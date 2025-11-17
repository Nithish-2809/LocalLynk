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
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid product id" });
    }
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


const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    const { id } = req.params;

    // Check if body is empty
    if (!Object.keys(updates).length) {
      return res.status(400).json({ msg: "No details provided to update!" });
    }

    // Find the product first
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    // Authorization check — only the seller can update
    if (product.Seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to edit this product!" });
    }
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      msg: "Product edited successfully!",
      updatedProduct,
    });

  } catch (error) {
    res.status(500).json({ msg: "Error updating product", error: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    // 2. Check ownership
    if (product.Seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized to delete this product!" });
    }

    // 3. Delete product
    await product.deleteOne();

    res.status(200).json({
      msg: "Product deleted successfully!"
    });

  } catch (error) {
    res.status(500).json({ msg: "Error deleting product!", error: error.message });
  }
};


const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ msg: "Search query is required" });
    }

    const products = await Product.find({
      productName: { $regex: name, $options: "i" } // i = case insensitive
    })
    .populate("Seller", "userName email")
    .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Search results fetched successfully!",
      total: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error searching products",
      error: error.message,
    });
  }
};


const getNearbyProducts = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 20000 } = req.query; 

    if (!lat || !lng) {
      return res.status(400).json({
        msg: "Latitude and longitude are required!"
      });
    }

    const products = await Product.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "distance",   
          maxDistance: parseFloat(maxDistance),
          spherical: true
        }
      },
    ]);


    const formatted = products.map(p => ({
      ...p,
      distanceKm: (p.distance / 1000).toFixed(2) + " km"
    }));

    res.status(200).json({
      msg: "Nearby products fetched successfully!",
      total: products.length,
      products: formatted
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error fetching nearby products",
      error: error.message
    });
  }
};


const getMyProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await Product.find({ Seller: userId })
      .sort({ createdAt: -1 })
      .populate("Seller", "userName email");

    res.status(200).json({
      msg: "Your products fetched successfully!",
      total: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      msg: "Error fetching your products",
      error: error.message
    });
  }
};



module.exports = {getAllProducts, getProductById, addProduct,updateProduct,deleteProduct,searchProducts,getNearbyProducts,getMyProducts};





