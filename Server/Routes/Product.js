const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getNearbyProducts,
  getMyProducts
} = require("../Controllers/Product");
const { restrictToLoggedinUserOnly } = require("../Middlewares/Auth");
const upload = require("../utils/Multer");

const productRouter = express.Router();

productRouter
  .post("/add", restrictToLoggedinUserOnly, upload.single("image"), addProduct)
  .get("/", getAllProducts)
  .get("/near", getNearbyProducts)
  .get("/my-products", restrictToLoggedinUserOnly, getMyProducts)
  .get("/search", searchProducts)
  .get("/:id", getProductById)
  .patch("/:id", restrictToLoggedinUserOnly, upload.single("image"), updateProduct)
  .delete("/:id", restrictToLoggedinUserOnly, deleteProduct);

module.exports = productRouter;
