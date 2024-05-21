const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");
const ProductModel = require("../../models/product");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { mailTemplate } = require("../../helper/template");
const { assetUrl, getByValue } = require("../../helper/utils");
const { getCartPopulated } = require("../../helper/cart");
const { validateCoupon } = require("../../helper/coupon");
const CouponModel = require("../../models/coupon");
const { ORDER_STATUS, PAYMENT_STATUS } = require("../../helper/constants");

dotenv.config();



const ORDER_MESSAGE = {
  //write message for each status
  PENDING: "Your order has been placed.",
  PLACED: "Your order has been placed.",
  PREPARED: "Your order has been prepared.",
  DISPATCHED: "Your order has been dispatched.",
  CANCELLED: "Your order has been cancelled.",
  DELIVERED: "Your order has been delivered.",
  RETURNED: "Your order has been returned.",
};

const fetchOrder = async (req, res, next) => {
  try {
    const orders = await OrderModel.find().populate({
      path: "user",
      select: "username",
    });

    return res.json({ status: 200, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "user  items.product"
    );

    return res.json({ status: 200, data: { order } });
  } catch (error) {
    next(error);
  }
};
const fetchUserOrder = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.user.userId });

    return res.json({ status: 200, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getUserOrder = async (req, res, next) => {
  try {
    let order = await OrderModel.findById(req.params.id)
      .populate("user")
      .populate({
        path: "items.product",
        populate: {
          path: "assets",
          select: "_id url title",
        },
      })
      .lean({
        virtuals: true,
      });

    return res.json({ status: 200, data: { order } });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const _id = req.body._id;

    const oldOrder = await OrderModel.findById(_id);

    const order = await OrderModel.updateOne(
      {
        _id: _id,
      },
      req.body
    );

    const newOrder = await OrderModel.findById(_id);

    if (oldOrder.status !== newOrder.status) {
      newOrder.timeline.push({
        status: newOrder.status,
        message: ORDER_MESSAGE[getByValue(newOrder.status)],
      });

      console.log(newOrder.timeline);
    }

    await newOrder.save();

    return res.json({
      status: 200,
      data: {
        id: _id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderShipping = async (req, res, next) => {
  try {
    const _id = req.body._id;

    const order = await OrderModel.updateOne(
      {
        _id: _id,
      },
      req.body
    );

    return res.json({
      status: 200,
      data: {
        id: _id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserOrder = async (req, res, next) => {
  try {
    const _id = req.body._id;

    const oldOrder = await OrderModel.findById(_id);

    const order = await OrderModel.updateOne(
      {
        _id: _id,
      },
      req.body,
      {
        upsert: true,
        new: true,
      }
    );

    const newOrder = await OrderModel.findById(_id);

    if (oldOrder.status !== newOrder.status) {
      newOrder.timeline.push({
        status: newOrder.status,
        message: ORDER_MESSAGE[getByValue(newOrder.status)],
      });
    }

    await newOrder.save();

    return res.json({
      status: 200,
      data: {
        id: _id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUserOrder = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user.userId);
    let items = await getCartPopulated(req.body.items);
    let address = user.addresses.id(req.body.address);
    let coupon_code = req.body.coupon_code;
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
            data: {},
          });
        }
      } else {
        return res.json({
          status: 400,
          data: {},
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
    });

    //emulate successful order
    order.status = ORDER_STATUS.PLACED;

    order.timeline.push({
      status: ORDER_STATUS.PLACED,
      message: ORDER_MESSAGE.PLACED,
    });

    order.paymentStatus = PAYMENT_STATUS.SUCCESS;

    await order.save();

    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.GMAIL_EMAIL,
    //     pass: process.env.GMAIL_APP_PASSWORD,
    //   },
    // });

    // const order_obj = await OrderModel.findById(order._id).populate(
    //   "user  items.product"
    // ).lean();

    // console.log("Order created: ", order);

    // const mailOptions = {
    //   from: "your_email@gmail.com",
    //   replyTo: "your_email@gmail.com",
    //   to: user.email,
    //   subject: "Order Confirmation",
    //   text: "This is a test email sent using Nodemailer.",
    //   html: mailTemplate(order_obj),
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error("Error sending email: ", error);
    //   } else {
    //     console.log("Email sent: ", info.response);
    //   }
    // });

    //let user = await UserModel.findById(req.user.userId);
    user.cart = [];
    await user.save();

    return res.json({
      status: 200,
      data: {
        order: {
          id: order._id,
        },
      },
    });
  } catch (error) {
    next(error);
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
};
