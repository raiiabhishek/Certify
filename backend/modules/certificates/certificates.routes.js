const express = require("express");
const certificateRouter = express.Router();
const { createCertificate } = require("./controller/createCertificate");
const reviewCertificate = require("./controller/reviewCertificate");
const auth = require("../../middleware/auth");
const reportCertificate = require("./controller/reportCertificate");
const getAllCertificate = require("./controller/getAllCertificate");
const getAllReports = require("./controller/getAllReports");
const revokeCertificate = require("./controller/revokeCertificate");

certificateRouter.get("/", getAllCertificate);
certificateRouter.get("/reports/", getAllReports);
certificateRouter.get("/review/:certificateId", reviewCertificate);
certificateRouter.post("/report/:certId", reportCertificate);
certificateRouter.use(auth);
certificateRouter.post("/generate/:templateId", createCertificate);
certificateRouter.delete("/revoke/:certificateId", revokeCertificate);
module.exports = certificateRouter;
