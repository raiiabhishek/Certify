const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const { ethers } = require("ethers");
const contractABI = require("../../../contractABI.json");
const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
require("dotenv").config();

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, signer);

const createBulk = async (req, res) => {
  const CertificateModel = mongoose.model("Certificate");
  const TemplateModel = mongoose.model("Template");
  const UserModel = mongoose.model("User");

  const { templateId } = req.params;

  let spreadsheetData;
  if (req.files && req.files["files"] && req.files["files"][0]) {
    const file = req.files["files"][0];
    const filePath = path.join(__dirname, "..", "..", "..", file.path);
    console.log("path", filePath);

    try {
      const workbook = XLSX.readFile(filePath); // Read the Excel file
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      spreadsheetData = XLSX.utils.sheet_to_json(sheet);
    } catch (excelError) {
      console.error("Error reading Excel file:", excelError);
      return res
        .status(400)
        .json({ error: "Error processing the uploaded spreadsheet file." });
    } finally {
      // Delete the uploaded file after reading
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  } else {
    return res.status(400).json({ error: "No spreadsheet file uploaded." });
  }

  console.log(templateId);
  if (!templateId || !spreadsheetData || !Array.isArray(spreadsheetData)) {
    return res
      .status(400)
      .json({ error: "Missing templateId or invalid spreadsheet data." });
  }

  try {
    // 1. Fetch the Template from database
    const template = await TemplateModel.findById(templateId);

    if (!template) {
      return res.status(404).json({ error: "Template not found." });
    }

    const variables = template.variables || [];

    const generatedCertificateDetails = []; // Array to store details of each generated certificate

    // Loop through each row of the spreadsheet data
    for (const rowData of spreadsheetData) {
      const extractedVariables = {};

      // Validate required fields from the spreadsheet row
      for (const variableName of variables) {
        if (rowData.hasOwnProperty(variableName)) {
          extractedVariables[variableName] = rowData[variableName];
        } else {
          return res.status(400).json({
            error: `Missing the ${variableName} field in one of the rows.`,
          });
        }
      }

      let modifiedTemplate = template.htmlContent;

      // 2. Replace Placeholders
      for (const variableName in extractedVariables) {
        if (extractedVariables.hasOwnProperty(variableName)) {
          const placeholder = new RegExp(`{{${variableName}}}`, "g");
          modifiedTemplate = modifiedTemplate.replace(
            placeholder,
            extractedVariables[variableName]
          );
        }
      }

      // 3. Prepare Blockchain Data and store into Blockchain
      const keys = Object.keys(extractedVariables);
      const values = Object.values(extractedVariables).map((value) => {
        if (typeof value === "number") {
          return value.toString();
        } else {
          return value;
        }
      });

      let tx, receipt, certificateId;

      try {
        tx = await contract.createCertificate(templateId, keys, values);
        receipt = await tx.wait();
        certificateId = receipt.logs[0].args.certificateId;
        console.log(certificateId);
      } catch (blockchainError) {
        console.error("Blockchain transaction failed:", blockchainError);
        // Handle blockchain errors appropriately.  Maybe skip this row, maybe stop.
        // For now, we skip it.
        generatedCertificateDetails.push({
          success: false,
          error: "Blockchain transaction failed",
          details: blockchainError.message,
          rowData,
        });
        continue; // Skip to the next row
      }

      //4. Create Database Entry
      const newCertificate = new CertificateModel({
        template: template._id,
        creator: req.user._id,
        solidityId: certificateId,
      });
      let savedCertificate;
      try {
        savedCertificate = await newCertificate.save();
      } catch (dbError) {
        console.error("Database save failed:", dbError);
        generatedCertificateDetails.push({
          success: false,
          error: "Database save failed",
          details: dbError.message,
          rowData,
        });
        continue; // Skip to the next row
      }

      //5. Generate PDF (using Puppeteer)
      const pdfFileName = `${certificateId}.pdf`;
      const rootDir = path.join(__dirname, "..", "..", ".."); // Adjust as needed based on how far from the root this file is
      const certificatesDir = path.join(rootDir, "public", "certificates");
      const pdfPath = path.join(certificatesDir, pdfFileName);

      // Ensure that the directory exists.  If not, create it.
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      //6. Generate QR Code Data
      const qrCodeData = `${process.env.FRONTEND_URL}/review-certificate/${certificateId}`;
      const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

      let browser; // Declare browser outside the try block
      try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const qrCodeHtml = `<div style="position: absolute; top: 20px; right: 20px;"><img src="${qrCodeBase64}" style="width: 100px; height: 100px;"/></div>`; // Adjust the position and size as needed

        await page.setContent(modifiedTemplate + qrCodeHtml, {
          waitUntil: "networkidle0",
        });

        // Get the content's bounding box
        const contentBox = await page.evaluate(() => {
          const body = document.body;
          return {
            width: body.scrollWidth,
            height: body.scrollHeight,
          };
        });

        // Generate the PDF with dynamic content size
        const pdfBuffer = await page.pdf({
          width: Math.ceil(contentBox.width) + "px", //add 1 px for safety
          height: Math.ceil(contentBox.height) + "px",
          printBackground: true,
          margin: {
            top: "10px",
            bottom: "10px",
            left: "10px",
            right: "10px",
          },
        });

        fs.writeFileSync(pdfPath, pdfBuffer);
        await browser.close();
        newCertificate.certificateUrl = `/certificates/${pdfFileName}`;
      } catch (pdfError) {
        console.error("PDF generation failed:", pdfError);
        generatedCertificateDetails.push({
          success: false,
          error: "PDF generation failed",
          details: pdfError.message,
          rowData,
        });
        if (browser) {
          await browser.close(); // Ensure browser is closed in case of error
        }
        continue; // Skip to the next row
      }

      let updatedCertificate;
      try {
        updatedCertificate = await newCertificate.save();
      } catch (dbUpdateError) {
        console.error("Database update failed:", dbUpdateError);
        generatedCertificateDetails.push({
          success: false,
          error: "Database update failed",
          details: dbUpdateError.message,
          rowData,
        });
        continue; // Skip to the next row
      }

      // 7. Update User Model with certificate ID
      try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
          user.certificates.push(savedCertificate._id);
          await user.save();
        }
      } catch (userUpdateError) {
        console.warn("User update failed:", userUpdateError);
        //Non critical error. Log the error and continue
      }

      // Store successful certificate generation details
      generatedCertificateDetails.push({
        success: true,
        certificateId: savedCertificate._id,
        pdfPath: `${pdfFileName}`,
        transactionHash: tx.hash,
        rowData,
      });
    }

    // 8. Return Success
    res.status(200).json({
      message: "Certificates created successfully!",
      certificateDetails: generatedCertificateDetails,
    });
  } catch (error) {
    console.error("Error creating certificates:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({
      error: "Failed to create certificates.",
      details: error.message,
    });
  }
};

module.exports = { createBulk };
