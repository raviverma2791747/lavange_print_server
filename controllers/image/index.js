const { assetUrl } = require("../../helper/utils");
const fs = require("fs");
const ImageModel = require("../../models/image");
const { s3 } = require("../../config/multerConfig");

const createImage = async (req, res) => {
  if (!req.file) {
    return res.json({
      status: 400,
      messages: ["File not found"],
    });
  }
  let filename;
  let url;
  if (
    process.env.NODE_ENV === "production" &&
    process.env.MEDIA_LOCAL === "false"
  ) {
    filename = req.file.key;
    url = req.file.location;
  } else {
    filename = req.file.filename;
    url = assetUrl(req.file.filename);
  }

  const imageId = filename;
  const title = req.body.title || "";

  const image = await ImageModel.create({
    _id: imageId,
    title: title,
  });

  return res.json({
    status: 200,
    data: {
      image: image,
    },
  });
};
const updateImage = async (req, res) => {
  const title = req.body.title || "";
  const imageId = req.body.id;

  const image = await ImageModel.findByIdAndUpdate(imageId, {
    title: title,
  });

  return res.json({
    status: 200,
    data: {
      image: {
        id: imageId,
      },
    },
  });
};

const fetchImage = async (req, res) => {
  const images = await ImageModel.find();
  return res.json({
    status: 200,
    data: {
      images,
    },
  });
};

const getImage = async (req, res) => {
  const imageId = req.params.id;
  const image = await ImageModel.findById(imageId);
  return res.json({
    status: 200,
    data: {
      image,
    },
  });
};

const deleteImage = async (req, res) => {
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
};

module.exports = {
  updateImage,
  getImage,
  fetchImage,
  createImage,
  deleteImage,
};
