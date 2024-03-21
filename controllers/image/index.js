const dotenv = require("dotenv");
const { assetUrl } = require("../../helper/utils");
const fs = require("fs");
const ImageModel = require("../../models/image");
const { S3Client } = require("@aws-sdk/client-s3");

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createImage = async (req, res, next) => {
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

    const id = filename;
    const title = req.body.title || "";

    const image = await ImageModel.create({
      _id: id,
      title: title,
    });

    return res.json({
      status: 200,
      data: {
        image: image,
      },
    });
  } catch (error) {
    next(error);
  }
};
const updateImage = async (req, res, next) => {
  try {
    const title = req.body.title || "";

    const image = await ImageModel.updateOne(
      {
        _id: req.body.id,
      },
      {
        title: title,
      }
    );

    return res.json({
      status: 200,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const fetchImage = async (req, res, next) => {
  try {
    const images = await ImageModel.find();
    return res.json({
      status: 200,
      data: {
        images,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getImage = async (req, res, next) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    return res.json({
      status: 200,
      data: {
        image,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: req.params.id,
      };

      const response = await s3.deleteObject(params).promise();
    } else {
      fs.unlinkSync(`./media/${req.params.id}`);
    }

    const image = await ImageModel.findByIdAndDelete(req.params.id);
    return res.json({
      status: 200,
      data: {
        image: {
          id: req.params.id,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateImage,
  getImage,
  fetchImage,
  createImage,
  deleteImage,
};
