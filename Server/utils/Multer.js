const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const cloudinary = require("./cloudinaryU")

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "locallynk_products",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });
module.exports = upload;
