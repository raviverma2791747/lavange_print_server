const schema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: true,
};

module.exports = schema;
