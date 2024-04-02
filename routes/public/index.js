const express = require("express");
const { getHomeConfigPublic } = require("../../controllers/homeconfig");
const {
  getUserProduct,
  fetchUserProduct,
} = require("../../controllers/product");
const {
  getUserCollection,
  fetchCollection,
  getUserCollectionSlug,
} = require("../../controllers/collection");
const {
  loginUserPublic,
  userExistPublic,
  registerUserPublic,
  loginUserGooglePublic,
  userLoginAdmin,
} = require("../../controllers/user");
const {
  fetchCategory,
  getUserCategory,
} = require("../../controllers/category");
const { getSearchFilters } = require("../../controllers/search");
const { applyCoupon } = require("../../controllers/coupon");
const { getUserCheckout } = require("../../controllers/checkout");
const asyncHandler = require("express-async-handler");

const router = express.Router();

router.get("/config/home", asyncHandler(getHomeConfigPublic));
router.get("/product/:slug", asyncHandler(getUserProduct));
router.get("/product", asyncHandler(fetchUserProduct));
router.post("/user/login", loginUserPublic);
router.post("/user/login/admin", userLoginAdmin);
router.post("/user/register", registerUserPublic);
router.post("/user/exist", userExistPublic);
router.post("/user/login/google", loginUserGooglePublic);
router.get("/category", fetchCategory);
router.get("/collection", fetchCollection);

router.get("/collection/:id", getUserCollection);
router.get("/collection/slug/:slug", getUserCollectionSlug);
router.get("/category/:id", getUserCategory);
router.get("/filters", getSearchFilters);
router.post("/coupon/apply", applyCoupon);
router.post("/checkout", getUserCheckout);

module.exports = router;
