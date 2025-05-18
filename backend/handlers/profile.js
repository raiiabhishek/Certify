const mongoose = require("mongoose");

const profile = async (req, res) => {
  const now = new Date();
  const UserModel = mongoose.model("User");
  const { id } = req.params;
  console.log(req.params);
  const getUser = await UserModel.findOne({
    _id: id,
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

module.exports = profile;
