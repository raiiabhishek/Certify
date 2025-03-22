const mongoose = require("mongoose");
const reportCertificate = async (req, res) => {
  const ReportModel = mongoose.model("Report");
  const UserModel = mongoose.model("User");
  const CertificateModel = mongoose.model("Certificate");
  const { comment } = req.body;
  const { certId } = req.params;
  try {
    const cert = await CertificateModel.findOne({ solidityId: certId });
    const newReport = await ReportModel.create({
      certificate: cert._id,
      comment,
    });
    const user = await UserModel.findById(cert.creator);
    console.log(user);
    user.reports.push(newReport._id);
    await user.save();
    res.status(201).send({ status: "success" });
  } catch (e) {
    res.status(400).send({ status: "error", msg: e });
  }
};
module.exports = reportCertificate;
