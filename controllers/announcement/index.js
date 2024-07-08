const mongoose = require("mongoose");
const AnnouncementModel = require("../../models/announcement");

const fetchAnnouncement = async (req, res) => {
  const { status } = req.query;
  let filter = {};
  if (status) {
    filter["status"] = status;
  }
  let announcements = await AnnouncementModel.find(filter).lean();
  return res.json({
    status: 200,
    data: {
      announcements,
    },
  });
};

const getAnnouncement = async (req, res) => {
  const announcementId = req.params.id;
  let announcement = await AnnouncementModel.findById(announcementId).lean();
  return res.json({
    status: 200,
    data: {
      announcement,
    },
  });
};

const updateAnnouncement = async (req, res) => {
  const announcementId = req.body._id ?? new mongoose.Types.ObjectId();
  const data = req.body;
  const announcement = await AnnouncementModel.updateOne(
    {
      _id: announcementId,
    },
    data,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      announcement: {
        id: announcementId,
      },
    },
  });
};

module.exports = { fetchAnnouncement, getAnnouncement, updateAnnouncement };
