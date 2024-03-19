const mongoose = require("mongoose");
const UserModel = require("../../models/user");
const { assetUrl } = require("../../helper/utils");

const getUserCart = async (req, res, next) => {
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

const addUserCart = async (req, res, next) => {
  try {
    const _id = req.user.userId;
    const user = await UserModel.findById(_id);
    console.log(req.user);
    const { productId, quantity, variantId, variantSchemaId } = req.body;

    //check if product in cart only allow max 10 qunatity for a single product
    //check if product in cart only allow max 10 qunatity for a single product

    //console.log(user.cart)
    let item = user.cart.find((cartItem) => {
      if (
        cartItem.product.equals(productId) &&
        cartItem.variant &&
        cartItem.variantSchema
      ) {
        if (variantId && variantSchemaId) {
          return (
            cartItem.product.equals(productId) &&
            cartItem.variant?.equals(variantId) &&
            cartItem.variantSchema?.equals(variantSchemaId)
          );
        } else {
          return false;
        }
      }
      return cartItem.product.equals(productId);
    });

    if (item) {
      //make sure qunatity not gretare than 10
      if (item.quantity + quantity <= 10) {
        item.quantity += quantity;
      } else {
        return res.json({ status: 400 });
      }
    } else {
      user.cart.push({
        product: productId,
        variant: variantId,
        variantSchema: variantSchemaId,
        quantity,
      });
    }

    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    next(error);
  }
};

const removeUserCart = async (req, res, next) => {
  try {
    const _id = req.user.userId;
    const user = await UserModel.findById(_id);
    const { itemId } = req.body;

    user.cart.pull(itemId);

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
