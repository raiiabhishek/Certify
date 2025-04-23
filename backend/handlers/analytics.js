const mongoose = require("mongoose");

const analytics = async (req, res) => {
  const UserModel = mongoose.model("User");
  const CertificateModel = mongoose.model("Certificate");
  const ReportModel = mongoose.model("Report");
  const certificateCount = await CertificateModel.countDocuments();
  const reportCount = await ReportModel.countDocuments();
  const unverifiedCounts = await UserModel.countDocuments({
    status: "not verified",
  });
  const verifiedCounts = await UserModel.countDocuments({
    status: "verified",
  });
  res.status(200).send({
    data: {
      certificateCount,
      reportCount,
      verifiedCounts,
      unverifiedCounts,
    },
  });
};

module.exports = analytics;
