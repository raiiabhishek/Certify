const mongoose = require("mongoose");

const user = async (req, res) => {
  const now = new Date();
  const UserModel = mongoose.model("User");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  })
    .populate("certificates")
    .populate("reports");
  res.status(200).send({
    data: getUser,
  });
};

module.exports = user;
