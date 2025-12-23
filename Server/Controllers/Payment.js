require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Payment = require("../Models/Payment");
const Order = require("../Models/Order");
const Product = require("../Models/Product");

/* ===============================
   CREATE PAYMENT (STRIPE)
   =============================== */
exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.status !== "pending") {
      return res.status(400).json({ msg: "Invalid order" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.amount * 100,
      currency: "inr",
      metadata: { orderId: order._id.toString() },
    });

    await Payment.create({
      order: order._id,
      buyer: order.buyer,
      amount: order.amount,
      stripePaymentIntentId: paymentIntent.id,
      status: "created",
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    res.status(500).json({ msg: "Payment creation failed" });
  }
};

/* ===============================
   VERIFY PAYMENT (STRIPE)
   =============================== */
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ msg: "Payment not successful" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // 1. Mark payment paid
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { status: "paid" }
    );

    // 2. Complete order
    order.status = "completed";
    await order.save();

    // 3. Mark product as SOLD (ONLY HERE)
    await Product.findByIdAndUpdate(order.product, {
      status: "sold",
    });

    res.json({ success: true, msg: "Payment successful" });
  } catch (err) {
    res.status(500).json({ msg: "Payment verification failed" });
  }
};

/* ===============================
   PAYMENT FAILED / CANCELLED
   =============================== */
exports.failPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    await Order.findByIdAndUpdate(orderId, {
      status: "cancelled",
    });

    res.json({ msg: "Payment cancelled" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to cancel payment" });
  }
};
