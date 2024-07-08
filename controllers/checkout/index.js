const mongoose = require("mongoose");
const { processCart } = require("../../helper/cart");
const { validateCoupon } = require("../../helper/coupon");
const { ServerConfigModel } = require("../../models/config");
const UserModel = require("../../models/user");

const getUserCheckout = async (req, res) => {
  const userID = req.user.userId;
  const user = await UserModel.findById(userID)
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
    .lean();
  const cart = user.cart;
  const coupon_code = req.body.coupon_code;
  const processed_cart = processCart(cart);

  //Cart Total
  const cartTotal = processed_cart.reduce((acc, item) => {
    if (item.compareAtPrice) {
      return acc + item.compareAtPrice * item.quantity;
    }
    return acc + item.price * item.quantity;
  }, 0);

  //Actual Selling Price Total
  const actualTotal = processed_cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  let discount = cartTotal - actualTotal;
  let couponValid = false;
  let couponMessage = [];

  const vc = await validateCoupon(coupon_code, processed_cart, userID);

  if (vc.status === 200) {
    discount = vc.data.discount;
    couponValid = true;
    couponMessage = vc.data.error;
  }
  const grandTotal = cartTotal - discount;

  const serverConfig = await ServerConfigModel.findOne({ name: "server" });

  return res.json({
    status: 200,
    data: {
      cart: processed_cart,
      cartTotal,
      discount,
      grandTotal,
      couponValid,
      couponMessage,
      paymentMethod: {
        paymentGateways: serverConfig?.paymentGateways ?? [],
      },
    },
  });
};

module.exports = { getUserCheckout };
