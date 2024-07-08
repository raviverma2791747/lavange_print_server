const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  getUserWishlist,
  addUserWishlist,
  removeUserWishlist,
} = require("../../../../controllers/wishlist");

const router = express.Router();

router.get("/", authenticate, asyncHandler(getUserWishlist));
router.post("/add", authenticate, asyncHandler(addUserWishlist));
router.post("/remove", authenticate, asyncHandler(removeUserWishlist));
module.exports = router;
