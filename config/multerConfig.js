const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

var storage;
var s3;

if (process.env.MEDIA_LOCAL === "false" && process.env.MEDIA_CDN === "aws"
) {
  console.log("Storage: S3");
  s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        `image-${new mongoose.Types.ObjectId().toString()}${path.extname(
          file.originalname
        )}`
      );
    },
  });
} else if (
  process.env.MEDIA_LOCAL === "false" &&
  process.env.MEDIA_CDN === "cloudinary"
) {
  console.log("Storage: Cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `${process.env.CLOUDINARY_FOLDER_NAME}`; // Update the folder path here
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId =  `image-${new mongoose.Types.ObjectId().toString()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
      };
    },
  });
} else {
  console.log("Storage: Local");
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${process.env.MEDIA_PATH}/`); // Specify the upload directory
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `image-${new mongoose.Types.ObjectId().toString()}${path.extname(
          file.originalname
        )}`
      ); // Use original filename
    },
  });
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

module.exports = {
  s3,
  storage,
  upload,
};
