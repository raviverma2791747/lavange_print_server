const express = require("express");
const { getHomeConfigPublic } = require("../../controllers/homeconfig");
const {
  getUserProduct,
  fetchUserProduct,
} = require("../../controllers/product");
const {
  getUserCollection,
  fetchCollection,
} = require("../../controllers/collection");
const {
  loginUserPublic,
  userExistPublic,
  registerUserPublic,
  loginUserGooglePublic,
  userLoginAdmin
} = require("../../controllers/user");
const { fetchCategory } = require("../../controllers/category");
const { getSearchFilters } = require("../../controllers/search");

const router = express.Router();

router.get("/config/home", getHomeConfigPublic);
router.get("/product/:slug", getUserProduct);
router.get("/product", fetchUserProduct);
router.post("/user/login", loginUserPublic);
router.post("/user/login/admin", userLoginAdmin);
router.post("/user/register", registerUserPublic);
router.post("/user/exist", userExistPublic);
router.post("/user/login/google", loginUserGooglePublic);
router.get("/category", fetchCategory);
router.get("/collection", fetchCollection);

router.get("/collection/:slug", getUserCollection);
router.get("/filters", getSearchFilters);

module.exports = router;
