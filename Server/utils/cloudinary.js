const cloudinary = require("cloudinary").v2;
require("dotenv").config();

console.log("CLOUDINARY_CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY =", process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING");
console.log("CLOUDINARY_API_SECRET =", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
