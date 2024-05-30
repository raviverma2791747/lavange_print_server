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
  loginUserGooglePublic,
  userLoginAdmin,
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
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/config/home", asyncHandler(getHomeConfigPublic));
router.get("/config/policy", asyncHandler(fetchPolicyConfig));
router.get("/product/:slug", asyncHandler(getUserProduct));
router.get("/product", asyncHandler(fetchUserProduct));
router.post("/user/login", loginUserPublic);
router.post("/user/login/admin", userLoginAdmin);
router.post("/user/register", registerUserPublic);
router.post("/user/exist", userExistPublic);
//legacy
router.post("/user/login/google", loginUserGooglePublic);
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
  (req, res) => {
    const { _id: userId, username: _username, firstName, lastName } = req.user; 
    const jwt_token = jwt.sign(
      { userId, username: _username, firstName, lastName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );

    res.cookie("token", jwt_token, {
      httpOnly: false
    });

    return res.redirect(req.authInfo.state.redirect_uri);
  }
);
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
