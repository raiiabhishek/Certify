const { ethers } = require("ethers");
require("dotenv").config();
const contractABI = require("../../../contractABI.json");

const connectToContract = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
};

const reviewCertificate = async (req, res) => {
  console.log("here");
  const certificateId = req.params.certificateId;

  if (!certificateId) {
    return res.status(400).json({ error: "Certificate ID is required" });
  }

  try {
    const contract = await connectToContract();
    const [templateId, keys, values] = await contract.getCertificateInfo(
      certificateId
    );

    const certificateData = {
      templateId,
      keys,
      values,
    };

    res.status(200).json(certificateData);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({
      error: "Failed to fetch certificate data",
      message: error.message,
    });
  }
};

module.exports = reviewCertificate;
