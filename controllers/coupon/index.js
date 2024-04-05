const mongoose = require("mongoose");
const CouponModel = require("../../models/coupon");
const voucher_codes = require("voucher-code-generator");
const {validateCoupon} = require("../../helper/coupon");
// const dotenv = require("dotenv");

// dotenv.config();

const fetchCoupon = async (req, res, next) => {
  try {
    const coupons = await CouponModel.find();
    return res.json({
      status: 200,
      data: {
        coupons,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);
    return res.json({
      status: 200,
      data: {
        coupon,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();
    let data = req.body;

    if (!data.code) {
      data.code = voucher_codes.generate({
        pattern: "########",
      })[0];
    }

    data.code = data.code.toLowerCase();

    const coupon = await CouponModel.updateOne(
      {
        _id,
      },
      data,
      {
        upsert: true,
        new: true,
      }
    );

    return res.json({
      status: 200,
      data: {
        coupon: {
          id: _id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const applyCoupon = async (req, res, next) => {
  try {

    const code = req.body.code;
    const cart = req.body.cart;
    const userID = req.body.userID;

    const result = await validateCoupon(code, cart, userID);

    return res.json(result);
    
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchCoupon, getCoupon, updateCoupon, applyCoupon };
