const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Web3 = require("web3");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
const auth = require("./middleware/auth");
const user = require("./handlers/user");
const getUserByID = require("./handlers/getUserById");
const settings = require("./handlers/settings");
const getUsers = require("./handlers/getUsers");
const templateRouter = require("./modules/templates/templates.routes");
const certificateRouter = require("./modules/certificates/certificates.routes");
const adminRouter = require("./modules/admin/admin.routes");
const analytics = require("./handlers/analytics");
const profile = require("./handlers/profile");
// Models
require("./models/userModel");
require("./models/templateModel");
require("./models/certificateModel");
require("./models/reportModel");
// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/files", express.static(path.join(__dirname, "public/files")));
app.use(
  "/certificates",
  express.static(path.join(__dirname, "public/certificates"))
);
// Database Connection
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

// Routes
app.post("/login", login);
app.post("/signUp/", uploadMiddleware, signUp);
app.post("/settings", uploadMiddleware, settings);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
app.get("/getUser/:id", getUserByID);
app.get("/users", getUsers);
app.use("/admin", adminRouter);
app.use("/templates", templateRouter);
app.use("/certificate", certificateRouter);
app.use(auth);
app.get("/analytics", analytics);
app.get("/profile/:id", profile);
app.get("/dashboard", user);
// Start the server
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
