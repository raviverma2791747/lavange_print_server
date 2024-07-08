const { STATUS } = require("./constants");

const processCart = (cart) => {
  const processed_cart = cart.map((cartItem) => {
    let isOutOfStock = false;
    let price = 0;
    let compareAtPrice = 0;
    let variant;
    if (cartItem.variant) {
      variant = cartItem.product.variants.id(cartItem.variant);
    } else {
      price = cartItem.product.price;
      compareAtPrice = cartItem.product.compareAtPrice;
    }

    if (variant) {
      price = variant.price;
      compareAtPrice = variant.compareAtPrice;
    } else {
      isOutOfStock = true;
    }

    if (cartItem.product.status !== STATUS.ACTIVE) {
      isOutOfStock = true;
    }

    return {
      product: cartItem.product,
      variant: cartItem.variant,
      quantity: cartItem.quantity,
      price: price,
      compareAtPrice: compareAtPrice,
      isOutOfStock: isOutOfStock,
    };
  });
  return processed_cart;
};

module.exports = { processCart };
