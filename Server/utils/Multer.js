const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "locallynk_products",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

module.exports = upload;
