const mongoose = require("mongoose");

const analytics = async (req, res) => {
  console.log("analytics");
  const CertificateModel = mongoose.model("Certificate");
  const ReportModel = mongoose.model("Report");
  const certificateCount = await CertificateModel.countDocuments();
  const reportCount = await ReportModel.countDocuments();
  res.status(200).send({
    data: {
      certificateCount,
      reportCount,
    },
  });
};

module.exports = analytics;
