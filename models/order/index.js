const { min, update } = require("lodash");
const mongoose = require("mongoose");
const {
  ORDER_STATUS,
  ADDRESS_TYPE,
  SHIPPING_VENDOR,
  PAYMENT_STATUS,
  PAYMENT_MODE,
  PAYMENT_GATEWAY,
} = require("../../helper/constants");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "product" },
        variant: { type: mongoose.SchemaTypes.ObjectId, default: null },
        price: { type: mongoose.SchemaTypes.Number },
        compareAtPrice: { type: mongoose.SchemaTypes.Number },
        quantity: {
          type: mongoose.SchemaTypes.Number,
          min: 1,
        },
      },
    ],
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    address: {
      fullName: {
        type: mongoose.SchemaTypes.String,
      },
      mobile: {
        type: mongoose.SchemaTypes.Number,
      },
      addressLine1: {
        type: mongoose.SchemaTypes.String,
      },
      addressLine2: {
        type: mongoose.SchemaTypes.String,
      },
      landmark: {
        type: mongoose.SchemaTypes.String,
      },
      city: {
        type: mongoose.SchemaTypes.String,
      },
      state: {
        type: mongoose.SchemaTypes.String,
      },
      country: {
        type: mongoose.SchemaTypes.String,
      },
      pincode: {
        type: mongoose.SchemaTypes.Number,
      },
      type: {
        type: mongoose.SchemaTypes.Number,
        enum: Object.values(ADDRESS_TYPE),
        default: ADDRESS_TYPE.HOME,
      },
    },
    status: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    timeline: [
      {
        updatedAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
        status: {
          type: mongoose.SchemaTypes.Number,
          enum: Object.values(ORDER_STATUS),
        },
        message: {
          type: mongoose.SchemaTypes.String,
        },
      },
    ],
    shipping: {
      vendor: {
        type: mongoose.SchemaTypes.Number,
        enum: Object.values(SHIPPING_VENDOR),
        default: SHIPPING_VENDOR.NONE,
      },
      trackingUrl: {
        type: mongoose.SchemaTypes.String,
        default: "",
      },
      price: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
      },
      trackingId: {
        type: mongoose.SchemaTypes.String,
        default: "",
      },
    },
    coupon: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "coupon",
    },
    discount: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    total: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    transactionId: {
      type: mongoose.SchemaTypes.String,
      default: "",
    },
    paymentStatus: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMode: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(PAYMENT_MODE),
      default: PAYMENT_MODE.ONLINE,
    },
    paymentGateway: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(PAYMENT_GATEWAY),
      default: PAYMENT_GATEWAY.NONE,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
