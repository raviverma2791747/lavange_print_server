const mongoose = require("mongoose");
const AnnouncementModel = require("../../models/announcement");

const fetchAnnouncement = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getAnnouncement = async (req, res, next) => {
  try {
    let announcement = await AnnouncementModel.findById({
      _id: req.params.id,
    }).lean();

    return res.json({
      status: 200,
      data: {
        announcement,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchAnnouncement, getAnnouncement, updateAnnouncement };
