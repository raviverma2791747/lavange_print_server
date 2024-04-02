const ProductModel = require("../models/product");

const getCartPopulated = async (cart) => {
  const cart_p = await Promise.all(
    cart.map(async (ci) => {
      let price = 0;
      let compareAtPrice = 0;
        const product = await ProductModel.findById(ci.product);
      let variant;
      if (ci.variant) {
        const variantConfig = product.variantConfigs.id(ci.variantSchema);
        variant = variantConfig.variants.id(ci.variant);
      } else {
        price = product.price;
        compareAtPrice = product.compareAtPrice;
      }

      if (variant) {
        price = variant.price;
        compareAtPrice = variant.compareAtPrice;
      }

      // console.log({
      //   product: ci.product,
      //   quantity: ci.quantity,
      //   variant: ci.variant,
      //   variantSchema: ci.variantSchema,
      //   price: price,
      // });

      return {
        product: ci.product,
        quantity: ci.quantity,
        variant: ci.variant,
        variantSchema: ci.variantSchema,
        price: price,
        compareAtPrice: compareAtPrice,
      };
    })
  );

  return cart_p;
}

module.exports = { getCartPopulated };
