const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  phonepeCallback,
  razorpayCallback,
} = require("../../../controllers/order");

const router = express.Router();

router.post("/payment/callback/phonepe", asyncHandler(phonepeCallback));
router.post("/payment/callback/razorpay", asyncHandler(razorpayCallback));

module.exports = router;
