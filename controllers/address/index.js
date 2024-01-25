const mongoose = require("mongoose");
const UserModel = require("../../models/user");

const fetchUserAddress = async (req, res) => {
  const _id = req.user.userId;
  let user = await UserModel.findById(_id).lean();
  return res.json({ status: 200, data: { address: user.address } });
};

const getUserAddress = async (req, res) => {
  const _id = req.user.userId;
  const address_id = req.params.id;
  let user = await UserModel.findById(_id);
  let address = user.addresses.id(address_id);
  return res.json({ status: 200, data: { address } });
};

const updateUserAddress = async (req, res) => {
  const _id = req.user.userId;
  const user = await UserModel.findById(_id);

  address = req.body;

  if (address._id) {
    user.addresses.id(address._id).set(address);
  } else {
    user.addresses.push(address);
  }

  await user.save();
  return res.json({ status: 200 });
};

module.exports = {
  fetchUserAddress,
  getUserAddress,
  updateUserAddress,
};
