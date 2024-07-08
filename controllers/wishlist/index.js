const UserModel = require("../../models/user");

const getUserWishlist = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId)
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
};

const addUserWishlist = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const { productId } = req.body;
  if (user.wishList.includes(productId)) {
    return res.json({
      status: 400,
      messages: ["Product already added to wishlist"],
    });
  }
  user.wishList.push(productId);
  await user.save();
  return res.json({ status: 200 });
};

const removeUserWishlist = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
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
