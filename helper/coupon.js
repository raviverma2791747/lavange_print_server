const CouponModel = require("../models/coupon");
const UserModel = require("../models/user");
const { isWithinInterval, parseISO } = require("date-fns");

const validateCoupon = async (code, cart, userID) => {
  if (!code) {
    return {
      status: 400,
      data: {
        error: ["Coupon code is required"],
      },
    };
  }

  if (!cart) {
    return {
      status: 400,
      data: {
        error: ["Cart is required"],
      },
    };
  }

  if (cart.length === 0) {
    return {
      status: 400,
      data: { error: ["Cart is empty"] },
    };
  }

  const coupon = await CouponModel.findOne({ code: code.toLowerCase() });

  if (!coupon) {
    return {
      status: 400,
      data: {
        error: ["Invalid coupon code"],
      },
    };
  }

  if (coupon.status !== "active") {
    return {
      status: 400,
      data: {
        error: ["Coupon code is not active"],
      },
    };
  }

  const startDate = parseISO(coupon.validity.startDate.toISOString());
  const endDate = parseISO(coupon.validity.endDate.toISOString());
  const now = new Date().toISOString();

  if (!isWithinInterval(now, { start: startDate, end: endDate })) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is expired"],
      },
    };
  }

  if (!coupon.redeem.limit) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code limit exceeded"],
      },
    };
  }

  const user = userID ? await UserModel.findById(userID) : null;

  if (coupon.redeem.individualLimit && !user) {
    return {
      status: 400,
      data: {
        errors: ["Invalid user"],
      },
    };
  }

  if (coupon.redeem.individualLimit && user) {
    if (
      coupon.redeem.individualLimit <=
      user.couponsUsed.reduce((acc, c) => {
        if (c === coupon._id) {
          return acc + 1;
        }
        return acc;
      }, 0)
    ) {
      return {
        status: 400,
        data: {
          errors: ["Coupon code limit exceeded"],
        },
      };
    }
  }

  if (coupon.users.length && !user) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is invalid"],
      },
    };
  }

  if (coupon.users.length && user) {
    if (!coupon.users.includes(user._id)) {
      return {
        status: 400,
        data: {
          errors: ["Coupon code is invalid"],
        },
      };
    }
  }

 

  // if (
  //   coupon.categories.length &&
  //   !coupon.categories.some((p) => {
  //     return cart.some((c) => {
  //       return c.category._id === p.toString();
  //     });
  //   })
  // ) {
  //   return {
  //     status: 400,
  //     data: {
  //       errors: ["Coupon code is invalids"],
  //     },
  //   };
  // }

  // if (
  //   coupon.collections.length &&
  //   !coupon.collections.some((p) => {
  //     return cart.some((c) => {
  //       return c.collection._id === p.toString();
  //     });
  //   })
  // ) {
  //   return {
  //     status: 400,
  //     data: {
  //       errors: ["Coupon code is invalids"],
  //     },
  //   };
  // }

  if (
    coupon.products.length &&
    !coupon.products.some((p) => {
      return cart.some((c) => {
        return c.product._id === p.toString();
      });
    })
  ) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is invalids"],
      },
    };
  }

  const totalQuantity = cart.reduce((acc, ci) => {
    return acc + ci.quantity;
  }, 0);

  if (coupon.quantity.minimum && totalQuantity < coupon.quantity.minimum) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is invalid"],
      },
    };
  }

  if (coupon.quantity.maximum && totalQuantity > coupon.quantity.maximum) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is invalid"],
      },
    };
  }

  const totalAmount = cart.reduce((acc, ci) => {
    if (ci.compareAtPrice) {
      return acc + ci.quantity * ci.compareAtPrice;
    }
    return acc + ci.quantity * ci.price;
  }, 0);

  if (coupon.amount.minimum && totalAmount < coupon.amount.minimum) {
    return {
      status: 400,
      data: {
        errors: ["Coupon code is invalid amount min"],
      },
    };
  }

  if (coupon.amount.maximum && totalAmount > coupon.amount.maximum) {
    let discount = 0;

    if (coupon.discount.type === "percentage") {
      discount = coupon.amount.maximum * (coupon.discount.amount / 100);
    } else {
      discount = coupon.discount.amount;
    }

    return {
      status: 200,
      data: {
        discount,
      },
    };
  }

  let discount = 0;

  if (coupon.discount.type === "percentage") {
    discount = totalAmount * (coupon.discount.amount / 100);
    console.log(totalAmount, coupon.discount.amount, discount);
  } else {
    discount = coupon.discount.amount;
  }

  return {
    status: 200,
    data: {
      discount,
    },
  };
};

module.exports = { validateCoupon };
