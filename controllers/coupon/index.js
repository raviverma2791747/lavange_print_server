const mongoose = require("mongoose");
const CouponModel = require("../../models/coupon");
const voucher_codes = require("voucher-code-generator");
const { validateCoupon } = require("../../helper/coupon");

const fetchCoupon = async (req, res) => {
  const filter = {};
  const status = req.query.status;
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  filter["name"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (status) {
    filter["status"] = status;
  }

  let sort = {};

  if (req.query.sort) {
    sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  const coupons = await CouponModel.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await CouponModel.find(filter).countDocuments();
  return res.json({
    status: 200,
    data: {
      coupons,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getCoupon = async (req, res) => {
  const couponId = req.params.id;
  const coupon = await CouponModel.findById(couponId);
  return res.json({
    status: 200,
    data: {
      coupon,
    },
  });
};

const updateCoupon = async (req, res) => {
  const couponId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;
  if (!data.code) {
    data.code = voucher_codes.generate({
      pattern: "########",
    })[0];
  }
  data.code = data.code.toLowerCase();
  const coupon = await CouponModel.updateOne(
    {
      _id: couponId,
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
        id: couponId,
        code: data.code,
      },
    },
  });
};

const applyCoupon = async (req, res) => {
  const code = req.body.code;
  const cart = req.body.cart;
  const userID = req.body.userID;
  const result = await validateCoupon(code, cart, userID);
  return res.json(result);
};

module.exports = { fetchCoupon, getCoupon, updateCoupon, applyCoupon };
