const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Template",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  certificateUrl: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  solidityId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Certificate", certificateSchema);
