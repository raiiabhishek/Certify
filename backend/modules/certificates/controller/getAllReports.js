const mongoose = require("mongoose");
const getAllReports = async (req, res) => {
  const ReportModel = mongoose.model("Report");
  try {
    const reports = await ReportModel.find().populate({
      path: "certificate",
      populate: [
        {
          path: "template",
        },
        {
          path: "creator",
        },
      ],
    });
    res.status(200).send({ data: reports });
  } catch (e) {
    res.status(400).send({ msg: e });
  }
};
module.exports = getAllReports;
