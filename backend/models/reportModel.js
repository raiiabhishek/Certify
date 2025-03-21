const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    certificate: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Report", reportSchema);
