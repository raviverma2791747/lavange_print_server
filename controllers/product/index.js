const mongoose = require("mongoose");
const ProductModel = require("../../models/product");
const { assetUrl } = require("../../helper/utils");
const { STATUS } = require("../../helper/constants");

const fetchProduct = async (req, res) => {
  const filter = {};
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;
  const status = req.query.status;

  if (status) {
    filter["status"] = status;
  }

  filter["title"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (req.query.categories) {
    filter["category"] = {
      $in: req.query.categories
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  if (req.query.collections) {
    filter["collections"] = {
      $in: req.query.collections
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  // if (req.query.tags) {
  //   filter["tags"] = {
  //     $in: req.query.tags
  //       .split(",")
  //       .map((id) => new mongoose.Types.ObjectId(id)),
  //   };
  // }

  // if (req.query.sort && req.query.order) {
  //   filter[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  // } else {
  //   filter["createdAt"] = -1;
  // }

  let sort = {};

  if (req.query.sort) {
    if (req.query.sort === "price") {
      console.log("price");
      sort["minPrice"] = req.query.order === "desc" ? -1 : 1;
    } else {
      sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }
  }

  const products = await ProductModel.find(filter)
    .populate("category")
    .populate({
      path: "assets",
      select: "_id url title",
    })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await ProductModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      products: products,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId)
    .populate("tags collections category")
    .lean({ virtuals: true });

  return res.json({
    status: 200,
    data: {
      product,
    },
  });
};

const updateProduct = async (req, res) => {
  const productId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;
  const product = await ProductModel.updateOne(
    {
      _id: productId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      product: {
        id: productId,
      },
    },
  });
};

const fetchUserProduct = async (req, res) => {
  const filter = { status: STATUS.ACTIVE };
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 10;

  filter["title"] = {
    $regex: req.query.search ?? "",
    $options: "i",
  };

  if (req.query.categories) {
    filter["category"] = {
      $in: req.query.categories
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  if (req.query.collections) {
    filter["collections"] = {
      $in: req.query.collections
        .split(",")
        .map((id) => new mongoose.Types.ObjectId(id)),
    };
  }

  // if (req.query.tags) {
  //   filter["tags"] = {
  //     $in: req.query.tags
  //       .split(",")
  //       .map((id) => new mongoose.Types.ObjectId(id)),
  //   };
  // }

  // if (req.query.sort && req.query.order) {
  //   filter[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  // } else {
  //   filter["createdAt"] = -1;
  // }

  let sort = {};

  if (req.query.sort) {
    if (req.query.sort === "price") {
      console.log("price");
      sort["minPrice"] = req.query.order === "desc" ? -1 : 1;
    } else {
      sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }
  }

  const products = await ProductModel.find(filter)
    .populate("category")
    .populate({
      path: "assets",
      select: "_id url title",
    })
    .select(
      "-shippingWeight -isDigitalProduct -hasSKU -barcode -tags -trackQuantity -inventoryQuantity"
    )
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await ProductModel.find(filter).countDocuments();

  return res.json({
    status: 200,
    data: {
      products: products,
      total: total,
      limit: limit,
      page: page,
    },
  });
};

const getUserProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findOne({
    _id: productId,
    status: STATUS.ACTIVE,
  })
    .populate("category")
    .populate({
      path: "assets",
      select: "_id url title",
    })
    .select(
      "-shippingWeight -isDigitalProduct -hasSKU -barcode -tags -trackQuantity -inventoryQuantity"
    )
    .lean({ virtuals: true });

  return res.json({
    status: 200,
    data: {
      product: product,
    },
  });
};
const getUserProductBySlug = async (req, res) => {
  const product = await ProductModel.findOne({
    slug: req.params.slug,
    status: STATUS.ACTIVE,
  })
    .populate("category")
    .populate({
      path: "assets",
      select: "_id url title",
    })
    .select(
      "-shippingWeight -isDigitalProduct -hasSKU -barcode -tags -trackQuantity -inventoryQuantity"
    )
    .lean({ virtuals: true });

  return res.json({
    status: 200,
    data: {
      product: product,
    },
  });
};

module.exports = {
  fetchProduct,
  getProduct,
  updateProduct,
  getUserProduct,
  getUserProductBySlug,
  fetchUserProduct,
};
