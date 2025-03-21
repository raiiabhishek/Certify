const express = require("express");
const certificateRouter = express.Router();
const { createCertificate } = require("./controller/createCertificate");
const reviewCertificate = require("./controller/reviewCertificate");

certificateRouter.post("/generate/:templateId", createCertificate);
certificateRouter.get("/review/:certificateId", reviewCertificate);

module.exports = certificateRouter;
