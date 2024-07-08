const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  getCoupon,
  fetchCoupon,
  updateCoupon,
  applyCoupon,
} = require("../../../controllers/coupon");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchCoupon));
router.get("/:id", authenticate, admin, asyncHandler(getCoupon));
router.post(
  "/",
  authenticate,
  admin,
  // validate(couponSchema),
  asyncHandler(updateCoupon)
);
router.post("/apply", authenticate, asyncHandler(applyCoupon));

module.exports = router;
