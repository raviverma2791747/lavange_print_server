const schema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    title: { type: "string" },
    asset: { type: "string" },
    ctaUrl: { type: "string" },
    status: { type: "string", enum: ["active", "draft", "archive"] },
  },
  required: ["title", "asset", "ctaUrl", "status"],
  additionalProperties: true,
};

module.exports = schema;
