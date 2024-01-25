const mongoose = require("mongoose");
const UserModel = require("../../models/user");

const getUserWishlist = async (req, res) => {
  const _id = req.user.userId;
  let user = await UserModel.findById(_id).populate("wishList").lean();

  user.wishList.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          asset.id
        }`,
      };
    });
  });
  return res.json({ status: 200, data: { wishList: user.wishList } });
};

const addUserWishlist = async (req, res) => {
  const _id = req.user.userId;
  const user = await UserModel.findById(req.user.userId);
  const { productId } = req.body;
  user.wishList.push(productId);
  await user.save();

  return res.json({ status: 200 });
};

const removeUserWishlist = async (req, res) => {
  const _id = req.user._id;
  const user = await UserModel.findById(_id);
  const { productId } = req.body;

  user.wishList.pull(productId);

  await user.save();

  return res.json({ status: 200 });
};

module.exports = {
  getUserWishlist,
  addUserWishlist,
  removeUserWishlist,
};
