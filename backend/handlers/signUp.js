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
const signUp = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { name, email, phone, password, registrationNumber } = req.body;
  const image = req.file ? path.basename(req.file.path) : null;

  const encPass = await bcrypt.hash(password, 10);
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }
    const userData = await UserModel.create({
      name,
      email,
      phone,
      password: encPass,
      image,
      registrationNumber,
    });
    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `<h1>Welcome, ${name}!</h1>
               <p>Thank you for registering on our platform. We are thrilled to have you here!</p>
               <p>If you have any questions or need assistance, feel free to contact us.</p>
               <p>Best regards,<br>Certify</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res
      .status(200)
      .json({ status: "success", msg: "registered", data: userData });
  } catch (e) {
    console.error("Signup error:", e);
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ status: "failed", msg: "Validation error:" + e.message });
    }
    return res.status(500).json({ status: "failed", msg: "Signup failed." });
  }
};

module.exports = signUp;
