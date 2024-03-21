const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const { assetUrl } = require("../../helper/utils");

const getUserWishlist = async (req, res, next) => {
  try {
    const _id = req.user.userId;
    let user = await UserModel.findById(_id)
      .populate({
        path: "wishList",
        populate: {
          path: "assets",
          select: "_id url title",
        },
      })
      .lean({
        virtuals: true,
      });

    return res.json({ status: 200, data: { wishList: user.wishList } });
  } catch (error) {
    next(error);
  }
};

const addUserWishlist = async (req, res, next) => {
  try {
    const _id = req.user.userId;
    const user = await UserModel.findById(req.user.userId);
    const { productId } = req.body;
    if (user.wishList.includes(productId)) {
      return res.json({
        status: 400,
        message: "Product already added to wishlist",
      });
    }
    user.wishList.push(productId);
    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

const removeUserWishlist = async (req, res, next) => {
  try {
    const _id = req.user.userId;
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
