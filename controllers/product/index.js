const mongoose = require("mongoose");
const ProductModel = require("../../models/product");
const { assetUrl } = require("../../helper/utils");

const fetchProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    if (search) {
      filter["name"] = {
        $regex: search,
        $options: "i",
      };
    }

    let products = await ProductModel.find({
      title: {
        $regex: search,
        $options: "i",
      },
    })
      .skip(page * limit)
      .limit(limit)
      .lean();

    products.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });
    });

    const total = await ProductModel.countDocuments({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    return res.json({
      status: 200,
      data: {
        products,
        total: total,
        page: page + 1,
        limit: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    let product = await ProductModel.findById({ _id: req.params.id })
      .populate("tags collections category")
      .lean();

    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: assetUrl(asset.id),
      };
    });

    return res.json({
      status: 200,
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();

    const product = await ProductModel.updateOne(
      {
        _id,
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
        product: {
          id: _id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const fetchUserProduct = async (req, res, next) => {
  try {
    const match_stage = {
      $match: {
        title: {
          $regex: req.query.search ?? "",
          $options: "i",
        },
      },
    };

    if (req.query.categories) {
      match_stage["$match"]["category.name"] = {
        $in: req.query.categories.split(","),
      };
    }

    if (req.query.collections) {
      match_stage["$match"]["collections"] = {
        $in: req.query.collections
          .split(",")
          .map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    let sort_stage;

    if (req.query.sort) {
      sort_stage = {
        $sort: {
          [req.query.sort]: req.query.order === "desc" ? -1 : 1,
        },
      };
    } else {
      sort_stage = {
        $sort: {
          createdAt: -1,
        },
      };
    }

    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      match_stage,
      {
        $addFields: {
          assets: {
            $map: {
              input: "$assets",
              as: "asset",
              in: {
                $mergeObjects: [
                  "$$asset",
                  {
                    url: {
                      $concat: [assetUrl(""), "$$asset.id"],
                    },
                  },
                ],
              },
            },
          },
          variantConfig: {
            $first: {
              $filter: {
                input: "$variantConfigs",
                as: "variantConfig",
                cond: {
                  $eq: ["$$variantConfig.status", "active"],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          variants: { $ifNull: ["$variantConfig.variants", null] },
          variantOptions: {
            $ifNull: [
              {
                $map: {
                  input: "$variantConfig.variantSchema",
                  as: "variantSchema",
                  in: {
                    displayName: "$$variantSchema.displayName",
                    name: "$$variantSchema.name",
                    type: "$$variantSchema.type",
                    options: {
                      $filter: {
                        input: "$$variantSchema.options",
                        as: "option",
                        cond: {
                          $eq: ["$$option.status", "active"],
                        },
                      },
                    },
                  },
                },
              },
              null,
            ],
          },
          schemaId: { $ifNull: ["$variantConfig._id", null] },
        },
      },
      // {
      //   $set : {
      //     price : {

      //     }
      //   }
      // },
      {
        $project: {
          variantConfigs: 0,
          shippingWeight: 0,
          isDigitalProduct: 0,
          hasSKU: 0,
          barcode: 0,
          tags: 0,
          variantConfig: 0,
        },
      },
      sort_stage,
    ]);

    return res.json({
      status: 200,
      data: {
        products: products,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.aggregate([
      {
        $match: {
          //_id: new mongoose.Types.ObjectId(req.params.id),
          slug: req.params.slug,
        },
      },
      {
        $addFields: {
          assets: {
            $map: {
              input: "$assets",
              as: "asset",
              in: {
                $mergeObjects: [
                  "$$asset",
                  {
                    url: {
                      $concat: [assetUrl(""), "$$asset.id"],
                    },
                  },
                ],
              },
            },
          },
          variantConfig: {
            $first: {
              $filter: {
                input: "$variantConfigs",
                as: "variantConfig",
                cond: {
                  $eq: ["$$variantConfig.status", "active"],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          variants: { $ifNull: ["$variantConfig.variants", null] },
          variantOptions: {
            $ifNull: [
              {
                $map: {
                  input: "$variantConfig.variantSchema",
                  as: "variantSchema",
                  in: {
                    displayName: "$$variantSchema.displayName",
                    name: "$$variantSchema.name",
                    type: "$$variantSchema.type",
                    options: {
                      $filter: {
                        input: "$$variantSchema.options",
                        as: "option",
                        cond: {
                          $eq: ["$$option.status", "active"],
                        },
                      },
                    },
                  },
                },
              },
              null,
            ],
          },
          schemaId: { $ifNull: ["$variantConfig._id", null] },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $set: {
          category: {
            $first: "$category",
          }
        }
      },
      {
        $project: {
          variantConfigs: 0,
          shippingWeight: 0,
          isDigitalProduct: 0,
          hasSKU: 0,
          barcode: 0,
          tags: 0,
          variantConfig: 0,
        },
      },
    ]);

    // let product = await ProductModel.findById({ _id: req.params.id })
    //   .populate("category")
    //   .lean();

    // product.assets = product.assets.map((asset) => {
    //   return {
    //     ...asset,
    //     url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${asset.id}`,
    //   };
    // });

    // const variantConfig = product.variantConfigs.find((variantConfig) => {
    //   return variantConfig.status === "active";
    // });

    // if (variantConfig !== undefined) {
    //   product.variants = variantConfig.variants;
    //   product.variantOptions = variantConfig.variantSchema;
    //   product.schemaId = variantConfig._id;
    // }

    // delete product.variantConfigs;

    return res.json({
      status: 200,
      data: {
        product: product[0],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchProduct,
  getProduct,
  updateProduct,
  getUserProduct,
  fetchUserProduct,
};
