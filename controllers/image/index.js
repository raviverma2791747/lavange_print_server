const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");

dotenv.config();

const updateImage = async (req,  res, next) => {
  try {
    if (!req.file) {
      return res.json({
        status: 500,
        data: {},
      });
    }

    let filename;
    let url;

    if (process.env.NODE_ENV === "production") {
      filename = req.file.key;
      url = req.file.location;
    } else {
      filename = req.file.filename;
      url = assetUrl(req.file.filename);
    }

    return res.json({
      status: 200,
      data: {
        img: {
          id: filename,
          url: url,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateImage };
