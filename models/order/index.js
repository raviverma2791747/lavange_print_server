const { min, update } = require("lodash");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "product" },
        variant: { type: mongoose.SchemaTypes.ObjectId, default: null },
        variantSchema: { type: mongoose.SchemaTypes.ObjectId, default: null },
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
        type: mongoose.SchemaTypes.String,
        enum: ["home", "work", "other"],
      },
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: [
        "pending",
        "placed",
        "prepared",
        "dispatched",
        "cancelled",
        "delivered",
        "returned",
      ],
      default: "pending",
    },
    timeline: [
      {
        updatedAt: { type: mongoose.SchemaTypes.Date, default: Date.now },
        status: {
          type: mongoose.SchemaTypes.String,
          enum: [
            "pending",
            "placed",
            "prepared",
            "dispatched",
            "cancelled",
            "delivered",
            "returned",
          ],
        },
        message: {
          type: mongoose.SchemaTypes.String,
        },
      },
    ],
    shipping: {
      vendor: {
        type: mongoose.SchemaTypes.String,
        enum: [
          "shiprocket",
          "delhivery",
          "amazon",
          "flipkart",
          "myntra",
          "none",
        ],
        default: "none",
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
      type: mongoose.SchemaTypes.String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    paymentType: {
      type: mongoose.SchemaTypes.String,
      enum: ["cod", "online"],
      default: "online",
    },
    paymentGateway: {
      type: mongoose.SchemaTypes.String,
      enum: ["paytm", "phonepe", "razorpay", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
