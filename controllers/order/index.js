const mongoose = require("mongoose");
const OrderModel = require("../../models/order");
const UserModel = require("../../models/user");
const ProductModel = require("../../models/product");

const fetchUserOrder = async (req, res) => {
  const orders = await OrderModel.find({ user: req.user.userId });

  return res.json({ status: 200, data: { orders } });
};

const getUserOrder = async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  return res.json({ status: 200, data: { order } });
};

const updateUserOrder = async (req, res) => {
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
};

const createUserOrder = async (req, res) => {
  const user = await UserModel.findById(req.user.userId);
 // console.log(req.body);
  let products = await  await Promise.all(req.body.products.map(async (ci) => {

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
  }));
  let address = user.addresses.id(req.body.address);

  console.log(req.body.address);

 // console.log(products);
  const order = await OrderModel.create({
    user: user._id,
    products: products,
    address: address,
  });
  return res.json({ status: 200 });
};

module.exports = {
  fetchUserOrder,
  getUserOrder,
  updateUserOrder,
  createUserOrder,
};
