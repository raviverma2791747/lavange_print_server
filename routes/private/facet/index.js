const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  fetchFacet,
  getFacet,
  updateFacet,
} = require("../../../controllers/facets");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchFacet));
router.get("/:id", authenticate, admin, asyncHandler(getFacet));
router.post("/", authenticate, admin, asyncHandler(updateFacet));

module.exports = router;
