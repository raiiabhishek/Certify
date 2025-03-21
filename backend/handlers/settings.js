const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");

// Transporter created here to be reused.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const settings = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { name, email, phone, password, course } = req.body;
  const image = req.files?.image?.[0]
    ? path.basename(req.files.image[0].path)
    : null;

  const encPass = await bcrypt.hash(password, 10);
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }
    let userData;
    // Handle candidate signup with resume processing logic.

    try {
      userData = await UserModel.findByIdAndUpdate(req.user._id, {
        name,
        email,
        phone,
        password: encPass,
        image,
        course,
      });
    } catch (e) {
      return res.status(500).json({
        status: "failed",
        msg: "Failed to process resume.",
      });
    }
    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Details Changed!",
      html: `<h1>Hello, ${name}!</h1>
               <p>Your details have been updated.</p>
               <p>If you have any questions or need assistance, feel free to contact us.</p>
               <p>Best regards,<br>DevX</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.status(200).json({ status: "success", msg: "updated", data: userData });
  } catch (e) {
    console.error("Signup error:", e);
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ status: "failed", msg: "Validation error:" + e.message });
    }
    return res.status(500).json({ status: "failed", msg: "Update failed." });
  }
};

module.exports = settings;
