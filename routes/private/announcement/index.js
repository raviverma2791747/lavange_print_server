const express = require("express");
const asyncHandler = require("express-async-handler");
const validate = require("../../../middlewares/validate");
const authenticate = require("../../../middlewares/authenticate");
const admin = require("../../../middlewares/admin");
const announcementSchema = require("../../../validators/announcement");
const {
  fetchAnnouncement,
  getAnnouncement,
  updateAnnouncement,
} = require("../../../controllers/announcement");

const router = express.Router();

router.get("/", authenticate, admin, asyncHandler(fetchAnnouncement));
router.get("/:id", authenticate, admin, asyncHandler(getAnnouncement));
router.post(
  "/",
  authenticate,
  admin,
  validate(announcementSchema),
  asyncHandler(updateAnnouncement)
);

module.exports = router;
