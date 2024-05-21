const { STATUS, WEIGHT_UNIT, FACET_TYPE } = require("../../helper/constants");

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
          type: "string",
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
    compareAtPrice: {
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
          type: "number",
          enum: Object.values(WEIGHT_UNIT),
        },
        value: {
          type: "number",
        },
      },
      required: ["unit", "value"],
    },
    status: {
      type: "number",
      enum: Object.values(STATUS),
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
              type: "number",
              enum: Object.values(STATUS),
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
                      type: "number",
                      enum: Object.values(FACET_TYPE),
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
                              type: "number",
                              enum: Object.values(STATUS),
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
                    compareAtPrice: {
                      type: "number",
                    },
                    assets: {
                      type: "array",
                      items: [
                        {
                          type: "string",
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
                    //"assets",
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
  required: [
    "title",
    "description",
    "price",
    "status",
    "variantConfigs",
    "assets",
  ],
  additionalProperties: true,
};

module.exports = schema;
