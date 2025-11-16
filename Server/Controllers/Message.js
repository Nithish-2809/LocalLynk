const Message = require("../models/messageModel");
const User = require("../models/userModel");

const storeMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { message, receiverId } = req.body;

    // Basic validation
    if (!message || !receiverId) {
      return res.status(400).json({ msg: "Message & Receiver ID required" });
    }

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }
    
    // Create and save message in DB
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
    });

    return res.status(201).json({
      success: true,
      msg: "Message stored successfully!",
      message: newMessage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { storeMessage };
