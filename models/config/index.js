const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const configSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: ["draft", "active", "archive"],
      default: "draft",
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);
configSchema.plugin(mongooseLeanVirtuals);

//Home config
const homeConfigSchema = new mongoose.Schema(
  {
    featuredCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
      },
    ],
    featuredAnnouncements: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "announcement",
      },
    ],
    bestSellerProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    newArrivalProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    featuredCollections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
      },
    ],
    exploreProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    exploreCollections: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "collection",
      },
    ],
    exploreProducts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: true,
  }
);
homeConfigSchema.plugin(mongooseLeanVirtuals);

//Delivery & Return Policy
const policyConfigSchema = new mongoose.Schema(
  {
    description: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
policyConfigSchema.plugin(mongooseLeanVirtuals);

const ConfigModel = mongoose.model("config", configSchema);
const HomeConfigModel = ConfigModel.discriminator("home", homeConfigSchema);
const PolicyConfigModel = ConfigModel.discriminator(
  "policy",
  policyConfigSchema
);

module.exports = { ConfigModel, HomeConfigModel, PolicyConfigModel };
