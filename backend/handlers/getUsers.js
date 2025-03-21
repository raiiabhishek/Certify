const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  const UserModel = mongoose.model("User");
  const users = await UserModel.find({ email: { $ne: "admin@gmail.com" } });
  res.status(200).send({ status: "success", data: users });
};
module.exports = getUsers;
