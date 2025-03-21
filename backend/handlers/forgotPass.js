const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: "failed", msg: "Email is required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", msg: "No user with that email exists." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
            <p>You requested a password reset.</p>
            <p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
            <p>This link is valid for 1 hour.</p>
            <p>If you have any questions or need assistance, feel free to contact us.</p>
            <p>Best regards,<br>SMS</p>
          `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error:", error);
        return res.status(500).json({
          status: "failed",
          msg: "Failed to send password reset email.",
        });
      }
      res
        .status(200)
        .json({ status: "success", msg: "Password reset email sent." });
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ status: "failed", msg: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res
      .status(400)
      .json({ status: "failed", msg: "New password is required" });
  }

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, //Ensure token is not expired
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", msg: "Invalid or expired reset token." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; //Clear the token
    user.resetPasswordExpires = undefined; //Clear the token

    await user.save();
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reseted",
      html: `
              <p>You password has been reset.</p>
              <p>If you have any questions or need assistance, feel free to contact us.</p>
              <p>Best regards,<br>SMS</p>
            `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error:", error);
        return res.status(500).json({
          status: "failed",
          msg: "Failed to send password reset email.",
        });
      }
    });
    res
      .status(200)
      .json({ status: "success", msg: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ status: "failed", msg: "Internal server error." });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
