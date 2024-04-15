const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { STATUS, NUMBER_TYPE } = require("../../helper/constants");

const couponSchema = new mongoose.Schema(
  {
    status: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(STATUS),
      default: STATUS.DRAFT,
      required: true,
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    code: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    discount: {
      amount: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
      },
      type: {
        type: mongoose.SchemaTypes.Number,
        enum: Object.values(NUMBER_TYPE),
        default: NUMBER_TYPE.ABSOLUTE,
        required: true,
      },
    },
    redeem: {
      limit: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
      },
      individualLimit: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
      },
    },
    validity: {
      startDate: {
        type: mongoose.SchemaTypes.Date,
        required: true,
      },
      endDate: {
        type: mongoose.SchemaTypes.Date,
        required: true,
      },
    },
    amount: {
      minimum: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
      },
      maximum: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
      },
    },
    quantity: {
      minimum: {
        type: mongoose.SchemaTypes.Number,
        default: 1,
        required: true,
      },
      maximum: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
      },
    },
    users: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        // required: true,
      },
    ],
    collections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
        // required: true,
      },
    ],
    categories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        // required: true,
      },
    ],
    products: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
        //required: true,
      },
    ],
  },
  { timestamps: true }
);

couponSchema.plugin(mongooseLeanVirtuals);
const CouponModel = mongoose.model("coupon", couponSchema);

module.exports = CouponModel;
