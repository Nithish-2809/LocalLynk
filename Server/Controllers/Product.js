const Product = require("../Models/Product")

const addProduct = async (req, res) => {
  const { productName, price, age, image, description, category, location } = req.body;

  if (!productName || !price || !age || !image || !description) {
    return res.status(400).json({
      msg: "All these fields are required!!",
    });
  }

  try {
    const productLocation = {
      type: "Point",
      coordinates: location?.coordinates || [0, 0],
      address: location?.address || "",
      city: location?.city || "",
    };

    const newProduct = await Product.create({
      productName,
      price,
      age,
      image,
      description,
      category,
      Seller: req.user._id, 
      location: productLocation, 
    });

    res.status(201).json({
      msg: "Product added successfully for sale!!",
      product: {
        id: newProduct._id,
        productName: newProduct.productName,
        price: newProduct.price,
        age: newProduct.age,
        category: newProduct.category,
        description: newProduct.description,
        location: newProduct.location,
      },
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to add new product!!",
      error: err.message,
    });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("Seller", "userName email")
      .sort({ createdAt: -1 })

    res.status(200).json({
      msg: "All products fetched successfully!",
      total: products.length,
      products,
    })
  } catch (error) {
    res.status(500).json({
      msg: "Failed to fetch products!",
      error: error.message,
    })
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "Seller",
      "userName email"
    );

    if (!product) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    res.status(200).json({
      msg: "Product fetched successfully!",
      product,
    });
  } catch (error) {
      res.status(500).json({
      msg: "Error fetching product details!",
      error: error.message,
    });
  }
};

module.exports = {getAllProducts, getProductById, addProduct };





