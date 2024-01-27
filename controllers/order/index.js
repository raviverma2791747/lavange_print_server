const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");
const ProductModel = require("../../models/product");

const fetchOrder = async (req,  res, next) => {
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

const getOrder = async (req,  res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "user  items.product"
    );

    return res.json({ status: 200, data: { order } });
  } catch (error) {
    next(error);
  }
};
const fetchUserOrder = async (req,  res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.user.userId });

    return res.json({ status: 200, data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getUserOrder = async (req,  res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    return res.json({ status: 200, data: { order } });
  } catch (error) {
    next(error);
  }
};

const updateUserOrder = async (req,  res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();

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

const createUserOrder = async (req,  res, next) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    // console.log(req.body);
    let items = await await Promise.all(
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

    console.log(req.body.address);

    // console.log(products);
    const order = await OrderModel.create({
      user: user._id,
      items: items,
      address: address,
    });
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
  createUserOrder,
  fetchOrder,
  getOrder,
};
