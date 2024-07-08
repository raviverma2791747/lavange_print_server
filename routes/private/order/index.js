const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const {
  updateOrderStatusSchema,
  updateOrderShippingSchema,
} = require("../../../validators/order");
const {
  updateUserOrder,
  createUserOrder,
  fetchOrder,
  getOrder,
  updateOrderStatus,
  updateOrderShipping,
} = require("../../../controllers/order");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchOrder));
router.get("/:id", authenticate, admin, asyncHandler(getOrder));
router.post("/create", authenticate, asyncHandler(createUserOrder));
router.post(
  "/:id/shipping",
  authenticate,
  admin,
  asyncHandler(updateUserOrder)
);
router.post(
  "/status",
  authenticate,
  admin,
  validate(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);
router.post(
  "/shipping",
  authenticate,
  admin,
  validate(updateOrderShippingSchema),
  asyncHandler(updateOrderShipping)
);

module.exports = router;
