const mongoose = require("mongoose");

const user = async (req, res) => {
  const now = new Date();
  const UserModel = mongoose.model("User");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  })
    .populate({
      path: "certificates",
    })
    .populate({
      path: "reports",
      populate: {
        path: "certificate",
        model: "Certificate",
      },
    });
  res.status(200).send({
    data: getUser,
  });
};

module.exports = user;
