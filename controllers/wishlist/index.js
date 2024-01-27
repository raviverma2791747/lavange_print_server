const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const { assetUrl } = require("../../helper/utils");

const getUserWishlist = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    let user = await UserModel.findById(_id).populate("wishList").lean();

    user.wishList.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });
    });
    return res.json({ status: 200, data: { wishList: user.wishList } });
  } catch (error) {
    next(error);
  }
};

const addUserWishlist = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    const user = await UserModel.findById(req.user.userId);
    const { productId } = req.body;
    user.wishList.push(productId);
    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

const removeUserWishlist = async (req,  res, next) => {
  try {
    const _id = req.user._id;
    const user = await UserModel.findById(_id);
    const { productId } = req.body;

    user.wishList.pull(productId);

    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserWishlist,
  addUserWishlist,
  removeUserWishlist,
};
