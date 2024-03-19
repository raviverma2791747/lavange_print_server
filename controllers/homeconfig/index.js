const mongoose = require("mongoose");
const { HomeConfigModel } = require("../../models/config");
const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");

dotenv.config();

// const fetchHomeConfig = async (req,  res, next) => {
//   const homeConfigs = await HomeConfigModel.find();

//   return res.json({
//     status: 200,
//     data: {
//       homeConfigs,
//     },
//   });
// };

const getHomeConfig = async (req, res, next) => {
  try {
    const homeConfig = await HomeConfigModel.findOne();
    return res.json({
      status: 200,
      data: {
        homeConfig,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateHomeConfig = async (req, res, next) => {
  try {
    const _id = req.body._id ?? new mongoose.Types.ObjectId();
    const homeConfig = await HomeConfigModel.updateOne(
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
        homeConfig: {
          id: _id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getHomeConfigPublic = async (req, res, next) => {
  try {
    console.log(req.user);
    // const homeConfig = await HomeConfigModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "announcements",
    //       localField: "featuredAnnouncements",
    //       foreignField: "_id",
    //       as: "featuredAnnouncements",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "exploreProducts",
    //       foreignField: "_id",
    //       as: "exploreProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "collections",
    //       localField: "exploreCollections",
    //       foreignField: "_id",
    //       as: "exploreCollections",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "bestSellerProducts",
    //       foreignField: "_id",
    //       as: "bestSellerProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "newArrivalProducts",
    //       foreignField: "_id",
    //       as: "newArrivalProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "collections",
    //       localField: "featuredCollections",
    //       foreignField: "_id",
    //       as: "featuredCollections",
    //     },
    //   },
    //   {
    //     $addFields : {
    //       featuredAnnouncements: {
    //         $map: {
    //           input: "$featuredAnnouncements",
    //           as: "announcement",
    //           in: {
    //             $mergeObjects: [
    //               "$$announcement",
    //               {
    //                 assetUrl: {
    //                   $concat: [
    //                     `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/`,
    //                     "$$announcement.assetId",
    //                   ]
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       }
    //     }
    //   },
    // {
    //   $unwind: "$featuredAnnouncements",
    // },
    // {
    //   $addFields: {
    //     "featuredAnnouncements.assetUrl": {
    //       $concat: [
    //         `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/`,
    //         "$featuredAnnouncements.assetId",
    //       ],
    //     },
    //   },
    // },
    // {
    //   $unwind: "$exploreProducts",
    // },
    // {
    //   $addFields: {
    //     "exploreProducts.assets": {
    //       $map: {
    //         input: "$exploreProducts.assets",
    //         as: "asset",
    //         in: {
    //           $mergeObjects: [
    //             "$$asset",
    //             {
    //               url: {
    //                 $concat: [
    //                   `${process.env.BASE_URI}:${
    //                     process.env.PORT || 3000
    //                   }/media/`,
    //                   "$$asset.id",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    // {
    //   $unwind: "$exploreCollections",
    // },
    // {
    //   $addFields: {
    //     "exploreCollections.assetUrl": {
    //       $concat: [
    //         `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/`,
    //         "$exploreCollections.assetId",
    //       ],
    //     },
    //   },
    // },
    // {
    //   $unwind: "$newArrivalProducts",
    // },
    // {
    //   $addFields: {
    //     "newArrivalProducts.assets": {
    //       $map: {
    //         input: "$newArrivalProducts.assets",
    //         as: "asset",
    //         in: {
    //           $mergeObjects: [
    //             "$$asset",
    //             {
    //               url: {
    //                 $concat: [
    //                   `${process.env.BASE_URI}:${
    //                     process.env.PORT || 3000
    //                   }/media/`,
    //                   "$$asset.id",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    // {
    //   $unwind: "$bestSellerProducts",
    // },
    // {
    //   $addFields: {
    //     "bestSellerProducts.assets": {
    //       $map: {
    //         input: "$bestSellerProducts.assets",
    //         as: "asset",
    //         in: {
    //           $mergeObjects: [
    //             "$$asset",
    //             {
    //               url: {
    //                 $concat: [
    //                   `${process.env.BASE_URI}:${
    //                     process.env.PORT || 3000
    //                   }/media/`,
    //                   "$$asset.id",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    // {
    //   $unwind: "$featuredCollections",
    // },
    // {
    //   $unwind: "$featuredCollections.products",
    // },
    // {
    //   $addFields: {
    //     "featuredCollections.products.assets": {
    //       $map: {
    //         input: "$featuredCollections.products.assets",
    //         as: "asset",
    //         in: {
    //           $mergeObjects: [
    //             "$$asset",
    //             {
    //               url: {
    //                 $concat: [
    //                   `${process.env.BASE_URI}:${
    //                     process.env.PORT || 3000
    //                   }/media/`,
    //                   "$$asset.id",
    //                 ],
    //               },
    //             },
    //           ],
    //         },
    //       },
    //     },
    //   },
    // },
    // {
    //   $group: {
    //     _id: "$_id",
    //     featuredAnnouncements: { $push: "$featuredAnnouncements" },
    //     exploreProducts: { $push: "$exploreProducts" },
    //     exploreCollections: { $push: "$exploreCollections" },
    //     newArrivalProducts: { $push: "$newArrivalProducts" },
    //     bestSellerProducts: { $push: "$bestSellerProducts" },
    //     featuredCollections: { $push: "$featuredCollections" },
    //   },
    // },
    //   {
    //     $project: {
    //       _id: 0,
    //       featuredAnnouncements: 1,
    //       exploreProducts: 1,
    //       // exploreCollections: 1,
    //       // newArrivalProducts: 1,
    //       // bestSellerProducts: 1,
    //       // featuredCollections: 1,
    //     },
    //   },
    //   {
    //     $limit: 1, // Assuming you only expect one document in the result
    //   },
    // ]);

    // const homeConfig = await HomeConfigModel.aggregate([
    //   { $match: {} },
    //   { $limit: 1 },
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "featuredCategories",
    //       foreignField: "_id",
    //       as: "featuredCategories",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "announcements",
    //       localField: "featuredAnnouncements",
    //       foreignField: "_id",
    //       as: "featuredAnnouncements",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "exploreProducts",
    //       foreignField: "_id",
    //       as: "exploreProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "collections",
    //       localField: "exploreCollections",
    //       foreignField: "_id",
    //       as: "exploreCollections",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "bestSellerProducts",
    //       foreignField: "_id",
    //       as: "bestSellerProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "newArrivalProducts",
    //       foreignField: "_id",
    //       as: "newArrivalProducts",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "collections",
    //       localField: "featuredCollections",
    //       foreignField: "_id",
    //       as: "featuredCollections",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       featuredCollections: {
    //         $map: {
    //           input: "$featuredCollections",
    //           as: "collection",
    //           in: {
    //             $mergeObjects: [
    //               "$$collection",
    //               {
    //                 products: {
    //                   $lookup: {
    //                     from: "products",
    //                     localField: "_id",
    //                     foreignField: "collection",
    //                     as: "products",
    //                   },
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // {
    //   //   $lookup: {
    //   //     from: "products",
    //   //     localField: "featuredCollections.products",
    //   //     foreignField: "_id",
    //   //     as: "featuredCollections.products"
    //   //   }
    //   // },
    //   {
    //     $project: {
    //       featuredCategories: 1,
    //       featuredAnnouncements: 1,
    //       exploreProducts: 1,
    //       exploreCollections: 1,
    //       bestSellerProducts: 1,
    //       newArrivalProducts: 1,
    //       featuredCollections: 1,
    //     },
    //   },
    // ]);
    let homeConfig = await HomeConfigModel.findOne()
      .populate("featuredCategories")
      .populate("featuredAnnouncements")
      .populate({ path: "exploreProducts", match: { status: "active" } })
      .populate({ path: "exploreCollections", match: { status: "active" } })
      .populate({ path: "bestSellerProducts", match: { status: "active" } })
      .populate({ path: "newArrivalProducts", match: { status: "active" } })
      .populate({
        path: "featuredCollections",
        match: { status: "active" },
        populate: { path: "products", match: { status: "active" } },
      })
      .lean();

    homeConfig.featuredAnnouncements = homeConfig.featuredAnnouncements.map(
      (announcement) => {
        return {
          ...announcement,
          assetUrl: assetUrl(announcement.assetId),
        };
      }
    );

    homeConfig.exploreProducts.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });

      let vc = product.variantConfigs.find((variantConfig) => {
        return variantConfig.status === "active";
      });

      if (vc) {
        product.variants = vc.variants;
      }
    });

    homeConfig.exploreCollections.forEach((collection) => {
      collection.assetUrl = assetUrl(collection.assetId);
    });

    homeConfig.newArrivalProducts.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });

      let vc = product.variantConfigs.find((variantConfig) => {
        return variantConfig.status === "active";
      });

      if (vc) {
        product.variants = vc.variants;
      }
    });

    homeConfig.bestSellerProducts.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: assetUrl(asset.id),
        };
      });

      let vc = product.variantConfigs.find((variantConfig) => {
        return variantConfig.status === "active";
      });

      if (vc) {
        product.variants = vc.variants;
      }
    });

    homeConfig.featuredCollections.forEach((collection) => {
      collection.products.forEach((product) => {
        product.assets = product.assets.map((asset) => {
          return {
            ...asset,
            url: assetUrl(asset.id),
          };
        });

        let vc = product.variantConfigs.find((variantConfig) => {
          return variantConfig.status === "active";
        });

        if (vc) {
          product.variants = vc.variants;
        }
      });
    });

    return res.json({
      status: 200,
      data: {
        homeConfig: homeConfig,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  //fetchHomeConfig,
  getHomeConfig,
  updateHomeConfig,
  getHomeConfigPublic,
};
