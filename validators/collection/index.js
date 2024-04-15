const { STATUS } = require("../../helper/constants");

const schema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    asset: { type: "string" },
    status: { type: "number", enum: Object.values(STATUS) },
    slug: { type: "string" },
  },
  required: ["name", "description", "asset", "status", "slug"],
  additionalProperties: true,
};

module.exports = schema;
