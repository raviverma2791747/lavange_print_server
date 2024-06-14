const express = require("express");
const { getHomeConfigPublic } = require("../../controllers/homeconfig");
const {
  getUserProduct,
  fetchUserProduct,
} = require("../../controllers/product");
const {
  getUserCollection,
  fetchUserCollection,
  getUserCollectionSlug,
} = require("../../controllers/collection");
const {
  loginUserPublic,
  userExistPublic,
  registerUserPublic,
  //loginUserGooglePublic,
  userLoginAdmin,
  userVerifyEmail,
  userLoginGoogle,
  userLogout,
  userSendPasswordResetEmail,
  userPasswordReset,
  // getAccessToken
} = require("../../controllers/user");
const {
  getUserCategory,
  getUserCategorySlug,
  fetchUserCategory,
} = require("../../controllers/category");
const { getSearchFilters } = require("../../controllers/search");
const { applyCoupon } = require("../../controllers/coupon");
const { getUserCheckout } = require("../../controllers/checkout");
const asyncHandler = require("express-async-handler");
const { fetchPolicyConfig } = require("../../controllers/policyconfig");

const passport = require("passport");
require("../../controllers/user/auth/google");
require("../../controllers/user/auth/jwt-auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/config/home", asyncHandler(getHomeConfigPublic));
router.get("/config/policy", asyncHandler(fetchPolicyConfig));
router.get("/product/:slug", asyncHandler(getUserProduct));
router.get("/product", asyncHandler(fetchUserProduct));
router.post("/user/login", loginUserPublic);
router.post("/user/login/admin", userLoginAdmin);
router.post("/user/register", registerUserPublic);
//router.post("/user/exist", passport.authenticate("jwt"), userExistPublic);
router.post("/user/exist", asyncHandler(userExistPublic));
//legacy
//router.post("/user/login/google", loginUserGooglePublic);
//new
router.get("/user/auth/google", (req, res, next) => {
  const redirect_uri = req.query.redirect_uri;
  passport.authenticate("google", {
    // scope: ["email", "profile"],
    state: {
      redirect_uri: redirect_uri,
    },
  })(req, res, next);
});
router.get(
  "/user/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.GOOGLE_CALLBACK_URL,
  }),
  asyncHandler(userLoginGoogle)
);
// router.post("/user/refresh/token", asyncHandler(getAccessToken));
router.post("/user/verify/email", asyncHandler(userVerifyEmail));
router.post("/user/logout", asyncHandler(userLogout));
router.post("/user/password/reset/:id/:token", asyncHandler(userPasswordReset));
router.post("/user/password/reset/link", asyncHandler(userSendPasswordResetEmail));
router.get("/category", fetchUserCategory);
router.get("/collection", fetchUserCollection);

router.get("/collection/:id", getUserCollection);
router.get("/collection/slug/:slug", getUserCollectionSlug);
router.get("/category/:id", getUserCategory);
router.get("/category/slug/:slug", getUserCategorySlug);
router.get("/filters", getSearchFilters);
router.post("/coupon/apply", applyCoupon);
router.post("/checkout", getUserCheckout);

module.exports = router;
