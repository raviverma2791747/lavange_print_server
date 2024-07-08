const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { STATUS, USER_STATUS, ADDRESS_TYPE } = require("../../helper/constants");
const ProductModel = require("../product");

const cartSchema = new mongoose.Schema({
  variant: {
    type: mongoose.SchemaTypes.ObjectId,
    default: null,
  },
  price: {
    type: mongoose.SchemaTypes.Number,
  },
  quantity: {
    type: mongoose.SchemaTypes.Number,
    default: 1,
  },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "product",
  },
});

// cartSchema.virtual("isOutOfStock").get(async function () {
//   const product = await ProductModel.findById(this.product);
//   if (!product) return true;
//   const variant = product.variants.id(this.variant);
//   if (!variant) return true;
//   return false;
// });

const userSchema = new mongoose.Schema(
  {
    status: {
      type: mongoose.SchemaTypes.Number,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.INACTIVE,
    },
    username: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      unique: true,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    isVerified: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    firstName: mongoose.SchemaTypes.String,
    lastName: mongoose.SchemaTypes.String,
    password: mongoose.SchemaTypes.String,
    dateOfBirth: mongoose.SchemaTypes.Date,
    // account: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "account",
    //   //required: true,
    // },
    // role: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "role", // Reference to the User model
    //   //required: true,
    // },
    wishList: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",
      },
    ],
    couponsUsed: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "coupon",
      },
    ],
    cart: [cartSchema],
    addresses: [
      {
        status: {
          type: mongoose.SchemaTypes.Number,
          enum: Object.values(STATUS),
          default: STATUS.ACTIVE,
        },
        default: {
          type: mongoose.SchemaTypes.Boolean,
          default: false,
        },
        fullName: {
          type: mongoose.SchemaTypes.String,
        },
        mobile: {
          type: mongoose.SchemaTypes.Number,
        },
        addressLine1: {
          type: mongoose.SchemaTypes.String,
        },
        addressLine2: {
          type: mongoose.SchemaTypes.String,
        },
        landmark: {
          type: mongoose.SchemaTypes.String,
        },
        city: {
          type: mongoose.SchemaTypes.String,
        },
        state: {
          type: mongoose.SchemaTypes.String,
        },
        country: {
          type: mongoose.SchemaTypes.String,
        },
        pincode: {
          type: mongoose.SchemaTypes.Number,
        },
        type: {
          type: mongoose.SchemaTypes.Number,
          enum: Object.values(ADDRESS_TYPE),
          default: ADDRESS_TYPE.HOME,
        },
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.plugin(mongooseLeanVirtuals);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
