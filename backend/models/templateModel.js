const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  htmlContent: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: [
      "education",
      "seminar",
      "training",
      "workshop",
      "participation",
      "competition",
      "job",
      "internship", //add category here
    ],
  },
  variables: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

templateSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // Extract variables from htmlContent before saving
  const variableRegex = /{{(.*?)}}/g;
  const matches = this.htmlContent.matchAll(variableRegex);

  const variables = new Set(); // Using Set to avoid duplicate variable entries
  for (const match of matches) {
    if (match && match[1]) {
      variables.add(match[1].trim());
    }
  }

  this.variables = Array.from(variables); // Convert Set to Array and save

  next();
});

module.exports = mongoose.model("Template", templateSchema);
