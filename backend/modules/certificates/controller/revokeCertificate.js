const dotenv = require("dotenv");
const ethers = require("ethers");
const mongoose = require("mongoose");
const fs = require("fs").promises;
dotenv.config();
const path = require("path");
const contractABI = require("../../../contractABI.json");

const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(contractAddress, contractABI, signer);

const revokeCertificate = async (req, res) => {
  const CertificateModel = mongoose.model("Certificate");
  const UserModel = mongoose.model("User");
  const ReportModel = mongoose.model("Report");
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID is required." });
    }

    const certificate = await CertificateModel.findById(certificateId);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found." });
    }

    // Convert the certificate ID to a BigNumber for contract interaction

    // Call the deleteCertificate function on the contract
    console.log(certificate.solidityId);
    // const tx = await contract.deleteCertificate(certificate.solidityId);

    // // Wait for the transaction to be mined
    // await tx.wait();

    // console.log(
    //   `Certificate with ID ${certificateId} has been revoked on contract.`
    // );

    // Remove the certificate ID from the user's certificates array
    await UserModel.updateOne(
      { certificates: certificateId },
      { $pull: { certificates: certificateId } }
    );
    console.log(
      `Certificate with ID ${certificateId} has been removed from user certificates array.`
    );

    // Delete reports associated with this certificate
    await ReportModel.deleteMany({ certificate: certificateId });

    console.log(
      `Reports associated with certificate ID ${certificateId} have been deleted.`
    );

    // Delete the certificate from the database
    await CertificateModel.findByIdAndDelete(certificateId);

    console.log(
      `Certificate with ID ${certificateId} has been deleted from db.`
    );
    if (certificate.certificateUrl) {
      try {
        const filePath = path.join(
          __dirname,
          "../../../public",
          certificate.certificateUrl
        );
        console.log(filePath);
        await fs.unlink(filePath);
        console.log(
          `File at ${certificate.certificateUrl} has been deleted from local storage.`
        );
      } catch (fsError) {
        console.error("Error deleting file from local storage:", fsError);
      }
    }
    res.status(200).json({
      message:
        "Certificate revoked, deleted from user and DB, and related reports deleted successfully.",
    });
  } catch (error) {
    console.error("Error revoking certificate:", error);

    if (error.message === "Certificate not found.") {
      return res.status(404).json({ error: "Certificate not found." });
    }

    res.status(500).json({
      error:
        "Failed to revoke certificate and delete from user, DB and reports.",
    });
  }
};

module.exports = revokeCertificate;
