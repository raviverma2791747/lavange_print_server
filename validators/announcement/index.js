const { STATUS } = require("../../helper/constants");

const schema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    title: { type: "string" },
    asset: { type: "string" },
    ctaUrl: { type: "string" },
    status: { type: "number", enum: Object.values(STATUS) },
  },
  required: ["title", "asset", "ctaUrl", "status"],
  additionalProperties: true,
};

module.exports = schema;
