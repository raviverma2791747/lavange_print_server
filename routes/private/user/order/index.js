const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../../middlewares/validate");
const authenticate = require("../../../../middlewares/authenticate");
const admin = require("../../../../middlewares/admin");
const {
  updateUserOrder,
  getUserOrder,
  fetchUserOrder,
  createUserOrder,
} = require("../../../../controllers/order");

const router = express.Router();
router.get("/", authenticate, asyncHandler(fetchUserOrder));
router.get("/:id", authenticate, asyncHandler(getUserOrder));
router.post("/create", authenticate, asyncHandler(createUserOrder));
router.post("/", authenticate, asyncHandler(updateUserOrder));

module.exports = router;
