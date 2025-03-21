const mongoose = require("mongoose");
const verify = async (req, res) => {
  const UserModel = mongoose.model("User");
  try {
    console.log("here");
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(id, {
      status: "verified",
    });
    if (!user) return res.status(400).send({ msg: "Failed" });
    res.status(200).send({ msg: "success" });
  } catch (e) {
    return res.status(400).send({ msg: e });
  }
};
module.exports = verify;
