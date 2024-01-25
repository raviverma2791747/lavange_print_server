const dotenv = require("dotenv");

dotenv.config();

const updateImage = async (req, res) => {
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
    url = `${process.env.BASE_URI}:${process.env.PORT || 3000}/media/${
      req.file.filename
    }`;
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
};

module.exports = { updateImage };
