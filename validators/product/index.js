const schema = {
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    assets: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
          required: ["id"],
        },
      ],
    },
    description: {
      type: "string",
    },
    specification: {
      type: "string",
    },
    price: {
      type: "number",
    },
    trackQuantity: {
      type: "boolean",
    },
    inventoryQuantity: {
      type: "number",
    },
    neverOutOfStock: {
      type: "boolean",
    },
    hasSKU: {
      type: "boolean",
    },
    sku: {
      type: "string",
    },
    barcode: {
      type: "string",
    },
    shippingWeight: {
      type: "object",
      properties: {
        unit: {
          type: "string",
          enum: ["kg", "g", "oz", "lb", "ml", "l"],
        },
        value: {
          type: "number",
        },
      },
      required: ["unit", "value"],
    },
    status: {
      type: "string",
      enum: ["draft", "active", "archive"],
    },
    isDigitalProduct: {
      type: "boolean",
    },
    category: {
      type: "object",
    },
    tags: {
      type: "array",
      uniqueItems: true,
    },
    collections: {
      type: "array",
      uniqueItems: true,
    },
    variantConfigs: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["draft", "active", "archive"],
            },
            variantSchema: {
              type: "array",
              items: [
                {
                  type: "object",
                  properties: {
                    displayName: {
                      type: "string",
                    },

                    name: {
                      type: "string",
                    },
                    type: {
                      type: "string",
                      enum: ["color", "size", "material", "other"],
                    },
                    options: {
                      type: "array",
                      items: [
                        {
                          type: "object",
                          properties: {
                            displayName: {
                              type: "string",
                            },
                            value: {
                              type: "string",
                            },
                            status: {
                              type: "string",
                              enum: ["draft", "active", "archive"],
                            },
                          },
                          required: ["displayName", "value", "status"],
                        },
                      ],
                    },
                  },
                  required: ["name", "displayName", "type", "options"],
                  additionalProperties: true,
                },
              ],
            },
            variants: {
              type: "array",
              items: [
                {
                  type: "object",
                  properties: {
                    sku: {
                      type: "string",
                    },
                    attributes: {
                      type: "object",
                    },
                    price: {
                      type: "number",
                    },
                    assets: {
                      type: "array",
                      items: [
                        {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                          },
                          required: ["id"],
                        },
                      ],
                    },
                    inventoryQuantity: {
                      type: "number",
                    },
                  },
                  required: [
                    "sku",
                    "attributes",
                    "price",
                    "assets",
                    "inventoryQuantity",
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
  required: ["title", "description", "price", "status", "variantConfigs", 'assets'],
  additionalProperties: true,
};

module.exports = schema;
