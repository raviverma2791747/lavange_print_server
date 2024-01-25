const mongoose = require("mongoose");
const AnnouncementModel = require("../../models/announcement");

const fetchAnnouncement = async (req, res) => {
  const { status } = req.query;

  let filter = {};

  if (status) {
    filter["status"] = status;
  }

  let announcements = await AnnouncementModel.find(filter).lean();
  announcements = announcements.map((announcement) => {
    return {
      ...announcement,
      assetUrl: `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
        announcement.assetId
      }`,
    };
  });

  return res.json({
    status: 200,
    data: {
      announcements,
    },
  });
};

const getAnnouncement = async (req, res) => {
  try {
    let announcement = await AnnouncementModel.findById({
      _id: req.params.id,
    }).lean();

    announcement.assetUrl = `${process.env.BASE_URI}:${
      process.env.PORT || 3000
    }/media/${announcement.assetId}`;

    return res.json({
      status: 200,
      data: {
        announcement,
      },
    });
  } catch {
    return res.json({
      status: 500,
      data: {},
    });
  }
};

const updateAnnouncement = async (req, res) => {
  const _id = req.body._id ?? new mongoose.Types.ObjectId();
  const announcement = await AnnouncementModel.updateOne(
    {
      _id: _id,
    },
    req.body,
    {
      upsert: true,
      new: true,
    }
  );
  return res.json({
    status: 200,
    data: {
      announcement: {
        id: _id,
      },
    },
  });
};

module.exports = { fetchAnnouncement, getAnnouncement, updateAnnouncement };
