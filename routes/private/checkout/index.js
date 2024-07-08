const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const { getUserCheckout } = require("../../../controllers/checkout");

const router = express.Router();

router.post("/", authenticate, asyncHandler(getUserCheckout));

module.exports = router;
