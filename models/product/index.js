const mongoose = require("mongoose");
const { assetUrl } = require("../../helper/utils");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    slug: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      index: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    specification: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    price: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    trackQuantity: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    inventoryQuantity: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    neverOutOfStock: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    hasSKU: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    sku: {
      type: mongoose.SchemaTypes.String,
    },
    barcode: {
      type: mongoose.SchemaTypes.String,
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["active", "draft", "archive"],
      default: "draft",
    },
    isDigitalProduct: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    shippingWeight: {
      value: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
      },
      unit: {
        type: mongoose.SchemaTypes.String,
        enum: ["kg", "g", "lb", "oz"],
        default: "kg",
      },
    },
    productType: {
      type: mongoose.SchemaTypes.String,
    },
    assets: [
      {
        id: { type: mongoose.SchemaTypes.String },
      },
    ],
    variantConfigs: [
      {
        status: {
          type: mongoose.SchemaTypes.String,
          enum: ["active", "draft", "archive"],
          required: true,
        },
        variantSchema: [
          {
            displayName: {
              type: mongoose.SchemaTypes.String,
              required: true,
            },
            name: {
              type: mongoose.SchemaTypes.String,
              required: true,
            },
            type: {
              type: mongoose.SchemaTypes.String,
              enum: ["color", "size", "material", "other"],
              default: "other",
              required: true,
            },
            options: [
              {
                displayName: {
                  type: mongoose.SchemaTypes.String,
                  required: true,
                },
                value: {
                  type: mongoose.SchemaTypes.String,
                  required: true,
                },
                status: {
                  type: mongoose.SchemaTypes.String,
                  enum: ["active", "draft", "archive"],
                  default: "draft",
                },
              },
            ],
          },
        ],
        variants: [
          {
            sku: {
              type: mongoose.SchemaTypes.String,
              required: true,
              default: "", // You can set a default value if needed
            },
            attributes: {
              type: mongoose.SchemaTypes.Mixed,
            },
            price: {
              type: mongoose.SchemaTypes.Number,
              required: true,
              default: 0, // You can set a default value if needed
            },
            assets: [
              {
                id: { type: mongoose.SchemaTypes.String },
              },
            ],
            inventoryQuantity: {
              type: mongoose.SchemaTypes.Number,
              required: true,
              default: 0,
            },
          },
        ],
      },
    ],
    tags: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "tag",
      },
    ],
    collections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
      },
    ],
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true }
);

productSchema.virtual("assets.url").get(function () {
  return this.assets.map((asset) => assetUrl(asset.id)); // Construct the full URLs
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
