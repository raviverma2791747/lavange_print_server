const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");
const ProductModel = require("../../models/product");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { mailTemplate } = require("../../helper/template");
const { assetUrl, getByValue } = require("../../helper/utils");
const { processCart } = require("../../helper/cart");
const { validateCoupon } = require("../../helper/coupon");
const CouponModel = require("../../models/coupon");
const {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_GATEWAY,
} = require("../../helper/constants");
const phonepe = require("../../helper/payment_gateway/phonepe");
const razorpay = require("../../helper/payment_gateway/razorpay");
const crypto = require("crypto");

dotenv.config();

const ORDER_MESSAGE = {
  //write message for each status
  PENDING: "Your order is pending for payment.",
  PLACED: "Your order has been placed.",
  PREPARED: "Your order has been prepared.",
  DISPATCHED: "Your order has been dispatched.",
  CANCELLED: "Your order has been cancelled.",
  DELIVERED: "Your order has been delivered.",
  RETURNED: "Your order has been returned.",
};

const fetchOrder = async (req, res) => {
  const orders = await OrderModel.find().populate({
    path: "user",
    select: "username",
  });
  return res.json({ status: 200, data: { orders } });
};

const getOrder = async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user items.product"
  );
  return res.json({ status: 200, data: { order } });
};

const updateOrderStatus = async (req, res) => {
  const orderId = req.body._id;
  const data = req.body;
  const oldOrder = await OrderModel.findById(orderId);
  const order = await OrderModel.updateOne(
    {
      _id: orderId,
    },
    data
  );
  const newOrder = await OrderModel.findById(orderId);
  if (oldOrder.status !== newOrder.status) {
    newOrder.timeline.push({
      status: newOrder.status,
      message: ORDER_MESSAGE[getByValue(ORDER_STATUS, newOrder.status)],
    });
  }
  await newOrder.save();
  return res.json({
    status: 200,
    data: {
      order: { id: orderId },
    },
  });
};

const updateOrderShipping = async (req, res) => {
  const orderId = req.body._id;
  const data = req.body;
  const order = await OrderModel.updateOne(
    {
      _id: orderId,
    },
    data
  );
  return res.json({
    status: 200,
    data: {
      order: { id: orderId },
    },
  });
};

const fetchUserOrder = async (req, res) => {
  const userId = req.user.userId;
  const orders = await OrderModel.find({ user: userId }).lean({
    virtuals: true,
  });
  return res.json({ status: 200, data: { orders } });
};

const getUserOrder = async (req, res) => {
  const orderId = req.params.id;
  const order = await OrderModel.findById(orderId)
    .populate("user")
    .populate({
      path: "items.product",
      populate: {
        path: "assets",
        select: "_id url title",
      },
      select:
        "_id status url title slug price variants variantSchema assets price compareAtPrice",
    })
    .lean({
      virtuals: true,
    });
  return res.json({ status: 200, data: { order } });
};

const updateUserOrder = async (req, res) => {
  const orderId = req.body._id;
  const data = req.body;
  const oldOrder = await OrderModel.findById(orderId);
  const order = await OrderModel.updateOne(
    {
      _id: orderId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );
  const newOrder = await OrderModel.findById(orderId);
  if (oldOrder.status !== newOrder.status) {
    newOrder.timeline.push({
      status: newOrder.status,
      message: ORDER_MESSAGE[getByValue(ORDER_STATUS, newOrder.status)],
    });
  }
  await newOrder.save();
  return res.json({
    status: 200,
    data: {
      order: { id: orderId },
    },
  });
};

const createUserOrder = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId).populate({
    path: "cart.product",
  });
  const items = processCart(user.cart);
  const address = user.addresses.id(req.body.address);
  const redirectUrl = req.body.redirectUrl;
  const coupon_code = req.body.coupon_code;
  const paymentMethod = req.body.paymentMethod;
  let discount = 0;
  let coupon;

  if (coupon_code) {
    const vc = await validateCoupon(coupon_code, items, user._id);
    if (vc.status === 200) {
      discount = vc.data.discount;
      coupon = await CouponModel.findOne({ code: coupon_code.toLowerCase() });
      if (!coupon) {
        return res.json({
          status: 400,
          messages: ["Invalid coupon code"],
        });
      }
    } else {
      return res.json({
        status: 400,
        messages: ["Invalid coupon code"],
      });
    }
  }

  const cartTotal = items.reduce((acc, item) => {
    if (item.compareAtPrice) {
      return acc + item.compareAtPrice * item.quantity;
    }
    return acc + item.price * item.quantity;
  }, 0);

  const actualTotal = items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  if (!discount) {
    discount = cartTotal - actualTotal;
  }
  const grandTotal = cartTotal - discount;
  
  const order = await OrderModel.create({
    user: user._id,
    items: items,
    address: address,
    discount: discount,
    coupon: coupon?._id,
    total: grandTotal,
    paymentGateway: paymentMethod,
  });
  order.status = ORDER_STATUS.PENDING;
  order.timeline.push({
    status: ORDER_STATUS.PENDING,
    message: ORDER_MESSAGE.PENDING,
  });
  await order.save();

  if (paymentMethod === PAYMENT_GATEWAY.PHONEPE) {
    const phonepeResponse = await phonepe.initiatePayment({
      transactionId: order._id,
      userId: user._id,
      amount: order.total,
      mobile: address.mobile,
      redirectMode: phonepe.REDIRECT_MODE.POST,
      redirectUrl: `${process.env.PHONEPE_CALLBACK_URL}?redirectUrl=${redirectUrl}`,
      callbackUrl: `${process.env.PHONEPE_CALLBACK_URL}?redirectUrl=${redirectUrl}`,
    });

    if (
      phonepeResponse.success &&
      phonepeResponse.code === phonepe.PAY_API_RESPONSE_CODE.PAYMENT_INITIATED
    ) {
      const paymentUrl =
        phonepeResponse.data.instrumentResponse.redirectInfo.url;

      return res.json({
        status: 200,
        data: {
          order: {
            id: order._id,
          },
          paymentGateway: PAYMENT_GATEWAY.PHONEPE,
          paymentUrl: paymentUrl,
        },
      });
    } else {
      order.status = ORDER_STATUS.CANCELLED;
      order.paymentStatus = PAYMENT_STATUS.FAILED;
      order.timeline.push({
        status: ORDER_STATUS.CANCELLED,
        message: `Payment failed, ${ORDER_MESSAGE.CANCELLED}`,
      });
      await order.save();
      return res.json({
        status: 500,
        data: {
          order: {
            id: order._id,
          },
        },
      });
    }
  } else if (paymentMethod === PAYMENT_GATEWAY.RAZORPAY) {
    const options = {
      amount: order.total * 100,
      currency: "INR",
      receipt: order._id,
    };

    razorpay.orders.create(options, (error, rzorder) => {
      if (error) {
        console.log(error);
        return res.json({
          status: 500,
          data: {},
          messages: ["Something went wrong"],
        });
      } else {
        return res.json({
          status: 200,
          data: {
            order: {
              id: order._id,
            },
            razorpay_order: rzorder,
            paymentGateway: PAYMENT_GATEWAY.RAZORPAY,
            razorpay_id_key: process.env.RAZORPAY_ID_KEY,
          },
        });
      }
    });
  } else {
    order.status = ORDER_STATUS.CANCELLED;
    order.paymentStatus = PAYMENT_STATUS.FAILED;
    order.timeline.push({
      status: ORDER_STATUS.CANCELLED,
      message: `Payment failed, ${ORDER_MESSAGE.CANCELLED}`,
    });
    await order.save();
    return res.json({
      status: 500,
      data: {
        order: {
          id: order._id,
        },
      },
      messages: ["No payment method selected"],
    });
  }
};

const phonepeCallback = async (req, res) => {
  const code = req.body.code;
  const merchantId = req.body.merchantId;
  const amount = req.body.amount;
  const transactionId = req.body.transactionId;
  const redirectUrl = req.query.redirectUrl;
  const providerReferenceId = req.body.providerReferenceId;

  const order = await OrderModel.findOne({
    _id: transactionId,
  });

  const responseStatus = await phonepe.checkStatus({
    merchantTransactionId: transactionId,
  });

  if (
    responseStatus.success &&
    responseStatus.code === phonepe.STATUS_API_RESPONSE_CODE.PAYMENT_SUCCESS
  ) {
    order.paymentStatus = PAYMENT_STATUS.SUCCESS;
    order.status = ORDER_STATUS.PLACED;
    order.timeline.push({
      status: ORDER_STATUS.PLACED,
      message: ORDER_MESSAGE.PLACED,
    });
    order.transactionId = responseStatus.data.transactionId;
    await order.save();

    let user = await UserModel.findById(order.user);
    user.cart = [];
    await user.save();

    return res.redirect(`${redirectUrl}/success/${order._id}`);
  } else {
    order.paymentStatus = PAYMENT_STATUS.FAILED;
    order.status = ORDER_STATUS.CANCELLED;
    order.timeline.push({
      status: ORDER_STATUS.CANCELLED,
      message: `Payment failed, ${ORDER_MESSAGE.CANCELLED}`,
    });
    await order.save();
    return res.redirect(`${redirectUrl}/failure/${order._id}`);
  }

  //Server to server callback
  // console.log("decoded", phonepe.decodeBase64(req.body.response));
  // const responseString = phonepe.decodeBase64(req.body.response);
  // const response = JSON.parse(responseString);
  // if (
  //   response.success &&
  //   response.code === phonepe.CALLBACK_API_RESPONSE_CODE.PAYMENT_SUCCESS
  // ) {
  //   const merchantTransactionId = response.data.merchantTransactionId;
  //   console.log("merchantTransactionId: ", merchantTransactionId);
  //   const order = await OrderModel.findOne({
  //     _id: merchantTransactionId,
  //   });
  //   if (order) {
  //     order.paymentStatus = PAYMENT_STATUS.SUCCESS;
  //     order.status = ORDER_STATUS.PLACED;
  //     order.timeline.push({
  //       status: ORDER_STATUS.PLACED,
  //       message: ORDER_MESSAGE.PLACED,
  //     });
  //     await order.save();

  //     return res.json({
  //       status: 200,
  //       data: {
  //         order: {
  //           id: order._id,
  //         },
  //       },
  //     });
  //   }
  // }
};

const razorpayCallback = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(sign.toString())
    .digest("hex");
  const isAuthentic = expectedSign === razorpay_signature;
  const rzorder = await razorpay.orders.fetch(razorpay_order_id);
  console.log(rzorder);
  const redirectUrl = req.query.redirectUrl;
  const order = await OrderModel.findOne({
    _id: rzorder.receipt,
  });

  if (isAuthentic && order) {
    order.paymentStatus = PAYMENT_STATUS.SUCCESS;
    order.status = ORDER_STATUS.PLACED;
    order.timeline.push({
      status: ORDER_STATUS.PLACED,
      message: ORDER_MESSAGE.PLACED,
    });
    order.transactionId = razorpay_payment_id;
    await order.save();

    let user = await UserModel.findById(order.user);
    user.cart = [];
    await user.save();

    return res.redirect(`${redirectUrl}/success/${order._id}`);
  } else {
    order.paymentStatus = PAYMENT_STATUS.FAILED;
    order.status = ORDER_STATUS.CANCELLED;
    order.timeline.push({
      status: ORDER_STATUS.CANCELLED,
      message: `Payment failed, ${ORDER_MESSAGE.CANCELLED}`,
    });
    await order.save();
    return res.redirect(`${redirectUrl}/failure/${order._id}`);
  }
};

module.exports = {
  fetchUserOrder,
  getUserOrder,
  updateUserOrder,
  updateOrderStatus,
  updateOrderShipping,
  createUserOrder,
  fetchOrder,
  getOrder,
  phonepeCallback,
  razorpayCallback,
};
