const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const { fetchRight } = require("../../../controllers/right");

const router = express.Router();

router.get("/", authenticate, asyncHandler(fetchRight));

module.exports = router;
