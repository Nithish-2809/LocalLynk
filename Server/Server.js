const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const ConnectToDataBase = require("./Connect");

// Routes
const userRouter = require("./Routes/User");
const productRouter = require("./Routes/Product");
const messageRouter = require("./Routes/Message");
const orderRouter = require("./Routes/Order");
const paymentRouter = require("./Routes/Payment");

// App & Server
const app = express();
const server = http.createServer(app);

// ==============================
// ENV
// ==============================
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL || "*";

// ==============================
// GLOBAL MIDDLEWARE
// ==============================
app.use(cors({
  origin: CLIENT_URL === "*" ? "*" : [CLIENT_URL],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ==============================
// SOCKET.IO
// ==============================
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL === "*" ? "*" : [CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message, productId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    const payload = {
      senderId,
      message,
      productId,
      createdAt: new Date().toISOString(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", payload);
    }

    socket.emit("messageSent", payload);
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// ==============================
// ROUTES
// ==============================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/message", messageRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);

// ==============================
// DATABASE
// ==============================
ConnectToDataBase(DATABASE_URL)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  });

// ==============================
// START SERVER (IMPORTANT FIX)
// ==============================
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
