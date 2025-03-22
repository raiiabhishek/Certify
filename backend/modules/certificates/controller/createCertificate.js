const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const { ethers } = require("ethers");
const contractABI = require("../../../contractABI.json");
const puppeteer = require("puppeteer"); // Added puppeteer

require("dotenv").config();

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI, signer);

const createCertificate = async (req, res) => {
  const CertificateModel = mongoose.model("Certificate");
  const TemplateModel = mongoose.model("Template");
  const UserModel = mongoose.model("User");
  const { templateId } = req.params;
  console.log(templateId);
  if (!templateId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 1. Fetch the Template from database
    const template = await TemplateModel.findById(templateId);

    if (!template) {
      return res.status(404).json({ error: "Template not found." });
    }

    const variables = template.variables || [];
    const extractedVariables = {};

    for (const variableName of variables) {
      if (req.body.hasOwnProperty(variableName)) {
        extractedVariables[variableName] = req.body[variableName];
      } else {
        return res
          .status(400)
          .json({ error: `Missing the ${variableName} field` });
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
    const keys = Object.keys(extractedVariables); // all keys in extractedVariables object will be the keys for smart contract
    const values = Object.values(extractedVariables); // all values of the object
    //try
    let tx = await contract.createCertificate(templateId, keys, values);
    const receipt = await tx.wait();
    const certificateId = receipt.logs[0].args.certificateId;
    console.log(certificateId);
    //4. Create Database Entry
    const newCertificate = new CertificateModel({
      template: template._id,
      creator: req.user._id,
      solidityId: certificateId,
    });
    const savedCertificate = await newCertificate.save();

    //5. Generate PDF (using Puppeteer)
    const pdfFileName = `${certificateId}.pdf`;
    const rootDir = path.join(__dirname, "..", "..", ".."); // Adjust as needed based on how far from the root this file is
    const certificatesDir = path.join(rootDir, "public", "certificates");
    const pdfPath = path.join(certificatesDir, pdfFileName);
    console.log(certificatesDir);
    // Ensure that the directory exists.  If not, create it.
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true }); // recursive creates any needed parent directories.
    }
    //6. Generate QR Code Data (after blockchain transaction and mongoDB to create the unique certificate identifier)
    const qrCodeData = `${process.env.FRONTEND_URL}/review-certificate/${certificateId}`;

    const qrCodeBase64 = await QRCode.toDataURL(qrCodeData); // Convert QR code to base64 for embedding

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    // Set content with replaced html

    // Inject the QR code as an image tag within the HTML content
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

    await browser.close();

    //save the pdf
    fs.writeFileSync(pdfPath, pdfBuffer);

    newCertificate.certificateUrl = `/certificates/${pdfFileName}`;

    const updatedCertificate = await newCertificate.save();
    console.log(req.user);
    // 7. Update User Model with certificate ID
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.certificates.push(savedCertificate._id);
      await user.save();
    }

    // 8. Return Success
    res.status(200).json({
      message: "Certificate created successfully!",
      transactionHash: tx.hash,
      certificateId: savedCertificate._id,
      pdfPath: `${pdfFileName}`,
    });
  } catch (error) {
    console.error("Error creating certificate:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: error.errors });
    }
    res
      .status(500)
      .json({ error: "Failed to create certificate.", details: error.message });
  }
};

module.exports = { createCertificate };
