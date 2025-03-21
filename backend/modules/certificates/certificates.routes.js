const express = require("express");
const certificateRouter = express.Router();
const { createCertificate } = require("./controller/createCertificate");
const reviewCertificate = require("./controller/reviewCertificate");
const auth = require("../../middleware/auth");
const reportCertificate = require("./controller/reportCertificate");

certificateRouter.get("/review/:certificateId", reviewCertificate);
certificateRouter.post("/report/:certId", reportCertificate);
certificateRouter.use(auth);
certificateRouter.post("/generate/:templateId", createCertificate);
module.exports = certificateRouter;
