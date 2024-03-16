const updateOrderStatusSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    status: {
      type: "string",
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
    paymentStatus: {
      type: "string",
      enum: ["pending", "success", "failed", "refunded"],
    },
    paymentType: {
      type: "string",
      enum: ["cod", "online"],
    },
    paymentGateway: {
      type: "string",
      enum: ["paytm", "phonepe", "razorpay", "none"],
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
          type: "string",
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
        type: { type: "string" },
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
