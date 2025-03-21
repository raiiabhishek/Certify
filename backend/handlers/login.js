const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  console.log("login");
  const UserModel = mongoose.model("User");
  const { email, password } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", msg: "No email provided" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ status: "failed", msg: "No password provided" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", msg: "No such user" });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(401)
        .json({ status: "failed", msg: "Password does not match" });
    }
    if (user.status == "not verified") {
      return res.status(404).json({
        status: "failed",
        msg: "You are not verified yet. Please wait for admin to verify ",
      });
    }

    const jwtSalt = process.env.jwt_salt;
    if (!jwtSalt) {
      return res.status(500).json({
        status: "failed",
        msg: "JWT secret not defined in environment",
      });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, jwtSalt);

    res.status(200).json({
      status: "success",
      token,
      role: user.role,
      id: user._id, // Correctly use user.role
    });
  } catch (error) {
    console.error("Login Error:", error); // Log the error for debugging
    res.status(500).json({ status: "failed", msg: "Internal server error" });
  }
};

module.exports = login;
