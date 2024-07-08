const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const { updateRole, getRole, fetchRole } = require("../../../controllers/role");
const router = express.Router();

router.get("/", authenticate, asyncHandler(fetchRole));
router.get("/:id", authenticate, asyncHandler(getRole));
router.post("/", authenticate, admin, asyncHandler(updateRole));

module.exports = router;
