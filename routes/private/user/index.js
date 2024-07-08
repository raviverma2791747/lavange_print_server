const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  fetchUser,
  getUser,
  updateUser,
  userInfo,
  updatePassword,
} = require("../../../controllers/user");

const addressRouter = require("./address");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const wishlistRouter = require("./wishlist");

const router = express.Router();

router.use("/address", addressRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
router.use("/wishlist", wishlistRouter);
router.get("/", authenticate, admin, asyncHandler(fetchUser));
router.get("/info", authenticate, asyncHandler(userInfo));
router.get("/:id", authenticate, admin, asyncHandler(getUser));
router.post("/", authenticate, admin, asyncHandler(updateUser));
router.post("/change-password", authenticate, asyncHandler(updatePassword));

module.exports = router;
