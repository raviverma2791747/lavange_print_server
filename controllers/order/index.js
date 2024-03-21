const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");
const ProductModel = require("../../models/product");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const { mailTemplate } = require("../../helper/template");
const { assetUrl } = require("../../helper/utils");

dotenv.config();

const ORDER_STATUS = {
  pending: "pending",
  placed: "placed",
  prepared: "prepared",
  dispatched: "dispatched",
  cancelled: "cancelled",
  delivered: "delivered",
  returned: "returned",
}

const ORDER_MESSAGE = {
  //write message for each status
  pending: "Your order has been placed.",
  placed: "Your order has been placed.",
  prepared: "Your order has been prepared.",
  dispatched: "Your order has been dispatched.",
  cancelled: "Your order has been cancelled.",
  delivered: "Your order has been delivered.",
  returned: "Your order has been returned.",
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
        message: ORDER_MESSAGE[newOrder.status],
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
        message: ORDER_MESSAGE[newOrder.status],
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
    let items = await Promise.all(
      req.body.items.map(async (ci) => {
        // console.log(ci);
        let price = 0;
        let product = await ProductModel.findById(ci.product);
        let variant;
        if (ci.variant) {
          let variantConfig = product.variantConfigs.id(ci.variantSchema);
          variant = variantConfig.variants.id(ci.variant);
        } else {
          price = product.price;
        }

        if (variant) {
          price = variant.price;
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
        };
      })
    );
    let address = user.addresses.id(req.body.address);

    const order = await OrderModel.create({
      user: user._id,
      items: items,
      address: address,
    });

    //emulate successful order
    order.status = ORDER_STATUS.placed;

    order.timeline.push({
      status: ORDER_STATUS.placed,
      message: ORDER_MESSAGE.placed,
    });


    order.paymentStatus = "success";

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
