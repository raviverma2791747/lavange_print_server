const mongoose = require("mongoose");
const { getCartPopulated } = require("../../helper/cart");
const { validateCoupon } = require("../../helper/coupon");
const { ServerConfigModel } = require("../../models/config");
const UserModel = require("../../models/user");

const getUserCheckout = async (req, res, next) => {
  try {
    const userID = req.user.userId;
    const user = await UserModel.findById(userID).populate({
      path: "cart",
      populate: {
        path: "product",
        populate: {
          path: "assets",
          // select: "_id url title ",
        },
      },
    }).lean();
     console.log(user.cart);
    const cart = user.cart;
    const coupon_code = req.body.coupon_code;

    const cartp = await getCartPopulated(cart);

    const cartTotal = cartp.reduce((acc, item) => {
      if (item.compareAtPrice) {
        return acc + item.compareAtPrice * item.quantity;
      }
      return acc + item.price * item.quantity;
    }, 0);

    const actualTotal = cartp.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    let discount = cartTotal - actualTotal;
    let couponValid = false;
    let couponMessage = [];

    const vc = await validateCoupon(coupon_code, cartp, userID);

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
        cart: cartp,
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
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserCheckout };
