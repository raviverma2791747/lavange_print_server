const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  getUserCart,
  addUserCart,
  removeUserCart,
  deleteUserCart,
} = require("../../../../controllers/cart");

const router = express.Router();

router.get("/", authenticate, asyncHandler(getUserCart));
router.post("/add", authenticate, asyncHandler(addUserCart));
router.post("/remove", authenticate, asyncHandler(removeUserCart));
router.post("/delete", authenticate, asyncHandler(deleteUserCart));

module.exports = router;
