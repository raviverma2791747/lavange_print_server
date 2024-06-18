const {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_MODE,
  PAYMENT_GATEWAY,
  SHIPPING_VENDOR,
  ADDRESS_TYPE,
} = require("../../helper/constants");

const updateOrderStatusSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    status: {
      type: "number",
      enum: Object.values(ORDER_STATUS),
    },
    paymentStatus: {
      type: "number",
      enum: Object.values(PAYMENT_STATUS),
    },
    paymentMode: {
      type: "number",
      enum: Object.values(PAYMENT_MODE),
    },
    paymentGateway: {
      type: "number",
      enum: Object.values(PAYMENT_GATEWAY),
    },
  },
  required: ["_id"],
  additionalProperties: false,
};

const updateOrderShippingSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    shipping: {
      type: "object",
      properties: {
        vendor: {
          type: "number",
          enum: Object.values(SHIPPING_VENDOR),
          default: SHIPPING_VENDOR.NONE,
        },
        trackingUrl: {
          type: "string",
        },
        price: {
          type: "number",
          default: 0,
        },
        trackingId: {
          type: "string",
          default: "",
        },
      },
    },
    address: {
      type: "object",
      properties: {
        fullName: { type: "string" },
        mobile: { type: "number" },
        adressLine1: { type: "string" },
        adressLine2: { type: "string" },
        landmark: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        country: { type: "string" },
        pincode: { type: "number" },
        type: { type: "number",  enum: Object.values(ADDRESS_TYPE) },
      },
    },
  },
  required: ["_id"],
  additionalProperties: false,
};

module.exports = {
  updateOrderStatusSchema,
  updateOrderShippingSchema,
};
