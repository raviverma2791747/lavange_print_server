const schema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    assetId: { type: "string" },
    status: { type: "string", enum: ["active", "draft", "archive"] },
    slug: { type: "string" },
  },
  required: ["name", "description", "assetId", "status", "slug"],
  additionalProperties: true,
};

module.exports = schema;
