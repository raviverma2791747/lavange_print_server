const { min } = require("lodash");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.SchemaTypes.ObjectId, ref: "product" },
        variant: { type: mongoose.SchemaTypes.ObjectId, default: null },
        variantSchema: { type: mongoose.SchemaTypes.ObjectId, default: null },
        price: { type: mongoose.SchemaTypes.Number },
        quantity: {
          type: mongoose.SchemaTypes.Number,
          min: 1,
        },
      },
    ],
    staus: {
      type: mongoose.SchemaTypes.String,
    },
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
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;
