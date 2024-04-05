const mongoose = require("mongoose");
const { getCartPopulated } = require("../../helper/cart");
const { validateCoupon } = require("../../helper/coupon");

const getUserCheckout = async (req, res, next) => {
  try {
    const userID = req.body.userID;
    const cart = req.body.cart;
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

    const vc = await validateCoupon(coupon_code, cartp, userID);

    console.log(vc);
    if (vc.status === 200) {
      discount = vc.data.discount;
      couponValid = true;
    }
    const grandTotal = cartTotal - discount;

    return res.json({
      status: 200,
      data: {
        cartTotal,
        discount,
        grandTotal,
        couponValid,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserCheckout };
