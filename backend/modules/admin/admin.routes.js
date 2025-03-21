const express = require("express");
const auth = require("../../middleware/auth");
const verify = require("./controller/verify");
const revoke = require("./controller/revoke");
const adminRouter = express.Router();

adminRouter.use(auth);
adminRouter.get("/verify/:id", verify);
adminRouter.get("/revoke/:id", revoke);
module.exports = adminRouter;
