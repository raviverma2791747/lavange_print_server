const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const { assetUrl } = require("../../helper/utils");

const getUserCart = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    let user = await UserModel.findById(_id).populate("cart.product").lean();

    // console.log(user.cart[0].product.assets);
    return res.json({
      status: 200,
      data: {
        cart: user.cart.map((cartItem) => {
          let ci = {
            ...cartItem,
          };

          ci.product.assets = [
            ...ci.product.assets.map((asset) => {
              return {
                ...asset,
                url: assetUrl(asset.id),
              };
            }),
          ];

          //console.log(ci.product);

          const variantConfig = ci.product.variantConfigs.find(
            (variantConfig) => {
              return variantConfig.status === "active";
            }
          );

          if (variantConfig !== undefined) {
            ci.product.variants = variantConfig.variants;
            ci.product.variantOptions = variantConfig.variantSchema;
            ci.product.schemaId = variantConfig._id;
          }

          //delete ci.product.variantConfigs;
          //console.log(ci.product.assets);
          return ci;
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

const addUserCart = async (req,  res, next) => {
  try {
    const _id = req.user.userId;
    const user = await UserModel.findById(_id);
    console.log(req.user);
    const { productId, quantity, variantId, variantSchemaId } = req.body;

    user.cart.push({
      product: productId,
      variant: variantId,
      variantSchema: variantSchemaId,
      quantity,
    });

    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

const removeUserCart = async (req,  res, next) => {
  try {
    const _id = req.user._id;
    const user = await UserModel.findById(_id);
    const { productId } = req.body;

    user.cart.pull(productId);

    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCart,
  addUserCart,
  removeUserCart,
};
