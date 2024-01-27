const mongoose = require("mongoose");
const UserModel = require("../../models/user");

const fetchUserAddress = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    let user = await UserModel.findById(_id).lean();
    return res.json({ status: 200, data: { address: user.address } });
  } catch (error) {
    next(error);
  }
};

const getUserAddress = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    const address_id = req.params.id;
    let user = await UserModel.findById(_id);
    let address = user.addresses.id(address_id);
    return res.json({ status: 200, data: { address } });
  } catch (error) {
    next(error);
  }
};

const updateUserAddress = async (req,  res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchUserAddress,
  getUserAddress,
  updateUserAddress,
};
