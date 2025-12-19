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
    })
    .populate("sender receiver", "userName email profilePic")
    .sort({ createdAt: 1 });

    res.status(200).json({
      msg: "CHAT HISTORY",
      total: chat.length,
      chat
    });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


const myChats = async (req, res) => {
  try {
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }]
    })
      .populate("sender receiver", "userName profilePic")
      .populate("product", "productName")
      .sort({ updatedAt: -1 });

    const chatMap = new Map();

    for (const msg of messages) {
      // safety check (important)
      if (!msg.product) continue;

      const otherUser =
        msg.sender._id.toString() === myId.toString()
          ? msg.receiver
          : msg.sender;

      const key = `${otherUser._id}_${msg.product._id}`;

      if (!chatMap.has(key)) {
        // ✅ compute unread count PER CHAT
        const unreadCount = await Message.countDocuments({
          sender: otherUser._id,
          receiver: myId,
          product: msg.product._id,
          isRead: false
        });

        chatMap.set(key, {
          user: otherUser,
          product: msg.product,
          lastMessage: msg.message,
          updatedAt: msg.updatedAt,
          unreadCount
        });
      }
    }

    res.status(200).json({
      chats: Array.from(chatMap.values())
    });

  } catch (error) {
    console.error("MY CHATS ERROR:", error);
    res.status(500).json({
      msg: "Failed to load chats",
      error: error.message
    });
  }
};


const markAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId, productId } = req.body;

    await Message.updateMany(
      {
        sender: userId,
        receiver: myId,
        product: productId,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark read" });
  }
};


module.exports = { storeMessage,chatHistory,myChats,markAsRead };
