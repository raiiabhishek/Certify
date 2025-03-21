const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    phone: {
      type: String,
      require: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    certificates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" },
    ],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
    image: {
      type: String,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration Number is not provided"],
    },
    status: {
      type: String,
      enum: ["verified", "not verified"],
      default: "not verified",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
