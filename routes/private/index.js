const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

//Middlewares
const validate = require("../../middlewares/validate");

//Validators
const tagSchema = require("../../validators/tag");
const productSchema = require("../../validators/product");
const announcementSchema = require("../../validators/announcement");
const collectionSchema = require("../../validators/collection");
const categorySchema = require("../../validators/category");

const { getStats } = require("../../controllers/stat");
const {
  getProduct,
  fetchProduct,
  updateProduct,
} = require("../../controllers/product");
const {
  updateImage,
  getImage,
  fetchImage,
  createImage,
  deleteImage,
} = require("../../controllers/image");
const { fetchTag, getTag, updateTag } = require("../../controllers/tag");
const {
  getAnnouncement,
  fetchAnnouncement,
  updateAnnouncement,
} = require("../../controllers/announcement");
const {
  fetchCollection,
  getCollection,
  updateCollection,
} = require("../../controllers/collection");
const {
  fetchCategory,
  getCategory,
  updateCategory,
} = require("../../controllers/category");
const {
  getHomeConfig,
  updateHomeConfig,
  getHomeConfigPopulated,
} = require("../../controllers/homeconfig");
const { fetchConfig } = require("../../controllers/config");
const {
  fetchUser,
  getUser,
  updateUser,
  userInfo,
  updatePassword,
} = require("../../controllers/user");
const authenticate = require("../../middlewares/authenticate");
const {
  getUserWishlist,
  addUserWishlist,
  removeUserWishlist,
} = require("../../controllers/wishlist");
const {
  getUserCart,
  addUserCart,
  removeUserCart,
  deleteUserCart,
} = require("../../controllers/cart");
const {
  fetchUserAddress,
  getUserAddress,
  updateUserAddress,
} = require("../../controllers/address");
const {
  updateUserOrder,
  getUserOrder,
  fetchUserOrder,
  createUserOrder,
  fetchOrder,
  getOrder,
  updateOrderStatus,
  updateOrderShipping,
} = require("../../controllers/order");
const {
  getCoupon,
  fetchCoupon,
  updateCoupon,
  applyCoupon,
} = require("../../controllers/coupon");
const { updateRole, getRole, fetchRole } = require("../../controllers/role");
const { fetchRight } = require("../../controllers/right");
const admin = require("../../middlewares/admin");
const dotenv = require("dotenv");
const {
  updateOrderStatusSchema,
  updateOrderShippingSchema,
} = require("../../validators/order");
const {
  getPolicyConfig,
  updatePolicyConfig,
} = require("../../controllers/policyconfig");
const asyncHandler = require("express-async-handler");
const {
  fetchFacet,
  getFacet,
  updateFacet,
} = require("../../controllers/facets");
const {
  getServerConfig,
  updateServerConfig,
} = require("../../controllers/serverConfig");
const { upload } = require("../../config/multerConfig");
const { getUserCheckout } = require("../../controllers/checkout");
dotenv.config();
const router = express.Router();

//Announcement
router.get("/announcement", authenticate, admin, fetchAnnouncement);
router.get("/announcement/:id", authenticate, admin, getAnnouncement);
router.post(
  "/announcement",
  authenticate,
  admin,
  validate(announcementSchema),
  updateAnnouncement
);

//Product
router.get("/product", authenticate, admin, fetchProduct);
router.get("/product/:id", authenticate, admin, getProduct);
router.post(
  "/product",
  authenticate,
  admin,
  validate(productSchema),
  updateProduct
);

//Image
router.post(
  "/image/upload",
  authenticate,
  admin,
  upload.single("img"),
  asyncHandler(createImage)
);
router.post("/image", authenticate, admin, updateImage);
router.get("/image/:id", authenticate, admin, getImage);
router.get("/image", authenticate, admin, fetchImage);
router.delete("/image/:id", authenticate, admin, deleteImage);

//Tags
router.get("/tag", authenticate, admin, fetchTag);
router.get("/tag/:id", authenticate, admin, getTag);
router.post("/tag", authenticate, admin, validate(tagSchema), updateTag);

//Collection
router.get("/collection", authenticate, admin, fetchCollection);
router.get("/collection/:id", authenticate, admin, getCollection);
router.post(
  "/collection",
  authenticate,
  admin,
  validate(collectionSchema),
  updateCollection
);

//Category
router.get("/category", authenticate, admin, fetchCategory);
router.get("/category/:id", authenticate, admin, getCategory);
router.post(
  "/category",
  authenticate,
  admin,
  validate(categorySchema),
  updateCategory
);

//Order
router.get("/order", authenticate, admin, fetchOrder);
router.get("/order/:id", authenticate, admin, getOrder);
router.post("/order/create", authenticate, createUserOrder);
router.post("/order/:id/shipping", authenticate, admin, updateUserOrder);
router.post(
  "/order/status",
  authenticate,
  admin,
  validate(updateOrderStatusSchema),
  updateOrderStatus
);
router.post(
  "/order/shipping",
  authenticate,
  admin,
  validate(updateOrderShippingSchema),
  updateOrderShipping
);
router.get("/user/order", authenticate, fetchUserOrder);
router.get("/user/order/:id", authenticate, getUserOrder);
router.post("/user/order/create", authenticate, createUserOrder);
router.post("/user/order", authenticate, updateUserOrder);

//Coupons
router.get("/coupon", authenticate, admin, fetchCoupon);
router.get("/coupon/:id", authenticate, admin, getCoupon);
router.post(
  "/coupon",
  authenticate,
  admin,
  // validate(couponSchema),
  updateCoupon
);

//Wishlist
router.get("/user/wishlist", authenticate, asyncHandler(getUserWishlist));
router.post("/user/wishlist/add", authenticate, addUserWishlist);
router.post("/user/wishlist/remove", authenticate, removeUserWishlist);

//Cart
router.get("/user/cart", authenticate, asyncHandler(getUserCart));
router.post("/user/cart/add", authenticate, addUserCart);
router.post("/user/cart/remove", authenticate, removeUserCart);
router.post("/user/cart/delete", authenticate, deleteUserCart);

//Address
router.get("/user/address", authenticate, fetchUserAddress);
router.get("/user/address/:id", authenticate, getUserAddress);
router.post("/user/address", authenticate, updateUserAddress);

//Role
router.get("/role", authenticate, fetchRole);
router.get("/role/:id", authenticate, getRole);
router.post("/role", authenticate, admin, updateRole);

//Right
router.get("/right", authenticate, fetchRight);

//User
router.get("/user", authenticate, admin, fetchUser);
router.get("/user/info", authenticate, asyncHandler(userInfo));
router.get("/user/:id", authenticate, admin, getUser);
router.post("/user", authenticate, admin, updateUser);
router.post(
  "/user/change-password",
  authenticate,
  asyncHandler(updatePassword)
);

//Config
router.get("/config", authenticate, admin, fetchConfig);

//Stat
router.get("/stats", authenticate, admin, asyncHandler(getStats));

//Home config
//router.get("/config/home", fetchHomeConfig);
router.get("/config/home", authenticate, getHomeConfig);
//router.get("/config/home/:id", getHomeConfig);
router.post("/config/home", authenticate, admin, updateHomeConfig);
router.get(
  "/config/policy/:name",
  authenticate,
  admin,
  asyncHandler(getPolicyConfig)
);
router.post(
  "/config/policy",
  authenticate,
  admin,
  asyncHandler(updatePolicyConfig)
);
router.get("/facet", authenticate, admin, asyncHandler(fetchFacet));
router.get("/facet/:id", authenticate, admin, asyncHandler(getFacet));
router.post("/facet", authenticate, admin, asyncHandler(updateFacet));
//User Routes

//Server Configs
router.get("/config/server", authenticate, admin, getServerConfig);
router.post("/config/server", authenticate, admin, updateServerConfig);

router.post("/coupon/apply", authenticate, applyCoupon);
router.post("/checkout",authenticate, getUserCheckout);

module.exports = router;
