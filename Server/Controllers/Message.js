const Message = require("../Models/Message")
const User = require("../Models/User");

const storeMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { message, receiverId, productId } = req.body;

    // Basic validation
    if (!message || !receiverId || !productId) {
      return res.status(400).json({ msg: "Message, Receiver & Product ID required" });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found!" });
    }

    // Create message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      product: productId,
      message,
    });

    return res.status(201).json({
      success: true,
      msg: "Message stored successfully!",
      message: newMessage,
    });

  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};


const chatHistory = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.params.userid;
    const productId = req.query.productId;

    if (!productId) {
      return res.status(400).json({ msg: "Product ID required for chat!" });
    }

    const receiver = await User.findById(user2);
    if (!receiver) {
      return res.status(404).json({ msg: "User not found!!" });
    }

    const chat = await Message.find({
      product: productId,
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({
      msg: "CHAT HISTORY",
      total: chat.length,
      chat
    });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


module.exports = { storeMessage,chatHistory };
