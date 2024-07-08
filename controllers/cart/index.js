const UserModel = require("../../models/user");
const { MAX_CART_ITEM_QUANTITY } = require("../../helper/constants");

const getUserCart = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId)
    .populate({
      path: "cart",
      populate: {
        path: "product",
        populate: {
          path: "assets",
          select: "_id url title",
        },
        select:
          "_id status url title slug price variants variantSchema assets price compareAtPrice",
      },
    })
    .lean({
      virtuals: true,
    });

  return res.json({
    status: 200,
    data: {
      cart: user.cart,
    },
  });
};

const addUserCart = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const { productId, quantity, variantId } = req.body;
  let item = user.cart.find((cartItem) => {
    if (cartItem.product.equals(productId) && cartItem.variant) {
      if (variantId) {
        return (
          cartItem.product.equals(productId) &&
          cartItem.variant?.equals(variantId)
        );
      } else {
        return false;
      }
    }
    return cartItem.product.equals(productId);
  });
  if (item) {
    //make sure qunatity not greater than MAX_CART_ITEM_QUANTITY
    if (item.quantity + quantity <= MAX_CART_ITEM_QUANTITY) {
      item.quantity += quantity;
    } else {
      return res.json({ status: 400 });
    }
  } else {
    user.cart.push({
      product: productId,
      variant: variantId,
      quantity,
    });
  }
  await user.save();
  return res.json({
    status: 200,
    data: { cart: { item: productId, variant: variantId } },
  });
};

const removeUserCart = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const { productId, quantity, variantId } = req.body;
  let item = user.cart.find((cartItem) => {
    if (cartItem.product.equals(productId) && cartItem.variant) {
      if (variantId) {
        return (
          cartItem.product.equals(productId) &&
          cartItem.variant?.equals(variantId)
        );
      } else {
        return false;
      }
    }
    return cartItem.product.equals(productId);
  });
  if (item) {
    if (item.quantity - quantity >= 1) {
      item.quantity -= quantity;
    } else {
      return res.json({ status: 400 });
    }
  } else {
    return res.json({ status: 400 });
  }
  await user.save();
  return res.json({
    status: 200,
    data: {
      cart: {
        item: productId,
        variant: variantId,
      },
    },
  });
};

const deleteUserCart = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId);
  const { itemId } = req.body;
  user.cart.pull(itemId);
  await user.save();
  return res.json({
    status: 200,
    data: {
      cart: {
        item: itemId,
      },
    },
  });
};

module.exports = {
  getUserCart,
  addUserCart,
  removeUserCart,
  deleteUserCart,
};
