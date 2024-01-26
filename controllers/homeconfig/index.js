const mongoose = require("mongoose");
const { HomeConfigModel } = require("../../models/config");
const dotenv = require("dotenv");

dotenv.config();

// const fetchHomeConfig = async (req, res) => {
//   const homeConfigs = await HomeConfigModel.find();

//   return res.json({
//     status: 200,
//     data: {
//       homeConfigs,
//     },
//   });
// };

const getHomeConfig = async (req, res) => {
  try {
    const homeConfig = await HomeConfigModel.findOne();
    return res.json({
      status: 200,
      data: {
        homeConfig,
      },
    });
  } catch {
    return res.json({
      status: 500,
      data: {},
    });
  }
};

const updateHomeConfig = async (req, res) => {
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
};

const getHomeConfigPublic = async (req, res) => {
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
    .populate("exploreProducts")
    .populate("exploreCollections")
    .populate("bestSellerProducts")
    .populate("newArrivalProducts")
    .populate({
      path: "featuredCollections",
      populate: { path: "products" },
    })
    .lean();

  homeConfig.featuredAnnouncements = homeConfig.featuredAnnouncements.map(
    (announcement) => {
      return {
        ...announcement,
        assetUrl: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          announcement.assetId
        }`,
      };
    }
  );

  homeConfig.exploreProducts.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          asset.id
        }`,
      };
    });
  });

  homeConfig.exploreCollections.forEach((collection) => {
    collection.assetUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.AWS_S3_URL}/${collection.assetId}`
        : `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
            collection.assetId
          }`;
  });

  homeConfig.newArrivalProducts.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          asset.id
        }`,
      };
    });
  });

  homeConfig.bestSellerProducts.forEach((product) => {
    product.assets = product.assets.map((asset) => {
      return {
        ...asset,
        url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
          asset.id
        }`,
      };
    });
  });

  homeConfig.featuredCollections.forEach((collection) => {
    collection.products.forEach((product) => {
      product.assets = product.assets.map((asset) => {
        return {
          ...asset,
          url: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
            asset.id
          }`,
        };
      });
    });
  });

  return res.json({
    status: 200,
    data: {
      homeConfig: homeConfig,
    },
  });
};

module.exports = {
  //fetchHomeConfig,
  getHomeConfig,
  updateHomeConfig,
  getHomeConfigPublic,
};
