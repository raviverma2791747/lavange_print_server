const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const { assetUrl } = require("../../helper/utils");
const { STATUS, WEIGHT_UNIT, FACET_TYPE } = require("../../helper/constants");

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
    compareAtPrice: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
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
    hsnCode: {
      type: mongoose.SchemaTypes.String,
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
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(STATUS),
      default: STATUS.DRAFT,
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
        type: mongoose.SchemaTypes.Number,
        enum: Object.values(WEIGHT_UNIT),
        default: WEIGHT_UNIT.KG,
      },
    },
    productType: {
      type: mongoose.SchemaTypes.String,
    },
    assets: [
      {
        type: mongoose.SchemaTypes.String,
        ref: "image",
      },
    ],
    variantConfigs: [
      {
        status: {
          type: mongoose.SchemaTypes.Number,
          enum: Object.values(STATUS),
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
              type: mongoose.SchemaTypes.Number,
              enum: Object.values(FACET_TYPE),
              default: FACET_TYPE.OTHER,
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
                  type: mongoose.SchemaTypes.Number,
                  enum: Object.values(STATUS),
                  default: STATUS.DRAFT,
                },
              },
            ],
          },
        ],
        variants: [
          {
            assets: [
              {
                type: mongoose.SchemaTypes.String,
                ref: "image",
              },
            ],
            sku: {
              type: mongoose.SchemaTypes.String,
              required: true,
              default: "", // You can set a default value if needed
            },
            attributes: {
              type: mongoose.SchemaTypes.Mixed,
            },
            compareAtPrice: {
              type: mongoose.SchemaTypes.Number,
              required: true,
              default: 0, // You can set a default value if needed
            },
            price: {
              type: mongoose.SchemaTypes.Number,
              required: true,
              default: 0, // You can set a default value if needed
            },
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

// productSchema.post("find", function (docs) {
//   docs.forEach((doc) => {
//     const v = doc.variantConfigs.find((config) => config.status === STATUS.ACTIVE);
//     if (v) {
//       doc.price = v.variants.reduce((min, variant) => {
//         return variant.price <= min ? variant.price : min;
//       }, Infinity);
//     }
//   });
// });

productSchema.virtual("maxPrice").get(function () {
  const v = this.variantConfigs.find(
    (config) => config.status === STATUS.ACTIVE
  );
  if (v) {
    return v.variants.reduce((max, variant) => {
      return variant.price >= max ? variant.price : max;
    }, 0);
  }
  return this.price;
});

productSchema.virtual("minPrice").get(function () {
  const v = this.variantConfigs.find(
    (config) => config.status === STATUS.ACTIVE
  );
  if (v) {
    return v.variants.reduce((min, variant) => {
      return variant.price <= min ? variant.price : min;
    }, Infinity);
  }
  return this.price;
});

productSchema.virtual("variants").get(function () {
  const v = this.variantConfigs.find(
    (config) => config.status === STATUS.ACTIVE
  );
  if (v) {
    return v.variants;
  }
  return null;
});

productSchema.virtual("variantOptions").get(function () {
  const v = this.variantConfigs.find(
    (config) => config.status === STATUS.ACTIVE
  );
  if (v) {
    return v.variantSchema;
  }
  return null;
});

productSchema.virtual("schemaId").get(function () {
  const v = this.variantConfigs.find(
    (config) => config.status === STATUS.ACTIVE
  );
  if (v) {
    return v._id;
  }
  return null;
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);
const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
