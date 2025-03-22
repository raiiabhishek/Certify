const mongoose = require("mongoose");
const getAllCertificate = async (req, res) => {
  const CertificateModel = mongoose.model("Certificate");
  try {
    const certificates = await CertificateModel.find()
      .populate("template")
      .populate("creator");
    res.status(200).send({ data: certificates });
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};
module.exports = getAllCertificate;
