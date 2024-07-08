const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  fetchUserAddress,
  getUserAddress,
  updateUserAddress,
} = require("../../../../controllers/address");

const router = express.Router();

router.get("/", authenticate, asyncHandler(fetchUserAddress));
router.get("/:id", authenticate, asyncHandler(getUserAddress));
router.post("/", authenticate, asyncHandler(updateUserAddress));

module.exports = router;
