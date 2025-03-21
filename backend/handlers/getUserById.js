const mongoose = require("mongoose");

const getUserByID = async (req, res) => {
  const UserModel = mongoose.model("User");
  const id = req.params.id;
  const getUser = await UserModel.findOne({
    _id: id,
  });
  res.status(200).send({ data: getUser });
};

module.exports = getUserByID;
