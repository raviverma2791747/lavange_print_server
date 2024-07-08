const mongoose = require("mongoose");
const UserModel = require("../../models/user");

const fetchUserAddress = async (req, res) => {
  const userId = req.user.userId;
  let user = await UserModel.findById(userId).lean();
  return res.json({ status: 200, data: { address: user.address } });
};

const getUserAddress = async (req, res) => {
  const userId = req.user.userId;
  const addressId = req.params.id;
  const user = await UserModel.findById(userId);
  const address = user.addresses.id(addressId);
  return res.json({ status: 200, data: { address } });
};

const updateUserAddress = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const address = req.body;
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
