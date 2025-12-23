const Product = require("../Models/Product");
const Order = require("../Models/Order");
const mongoose = require("mongoose");

const buyProduct = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { productid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productid)) {
      return res.status(400).json({ msg: "Invalid product id" });
    }

    // 1. Fetch product (DO NOT update status)
    const product = await Product.findById(productid);

    if (!product || product.status !== "available") {
      return res
        .status(409)
        .json({ msg: "Product already sold or unavailable" });
    }

    // 2. Prevent self-buy
    if (product.Seller.toString() === buyerId.toString()) {
      return res
        .status(403)
        .json({ msg: "You cannot buy your own product!" });
    }

    // 3. Create order (pending)
    const order = await Order.create({
      buyer: buyerId,
      seller: product.Seller,
      product: product._id,
      amount: product.price,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      msg: "Order created. Proceed to payment.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Order failed",
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ buyer: userId })
      .populate("product", "productName price image status")
      .populate("seller", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

module.exports = { buyProduct, getMyOrders };
