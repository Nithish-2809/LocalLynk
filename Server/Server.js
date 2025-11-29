const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");   // ADD THIS
const User = require("./Models/User");
const userRouter = require("./Routes/User");
const Product = require("./Models/Product");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const ConnectToDataBase = require("./Connect");
const productRouter = require("./Routes/Product");
const messageRouter = require("./Routes/Message");
const orderRouter = require("./Routes/Order");

const DATABASE_URL = process.env.DATABASE_URL;

// ========== ENABLE CORS ==========
app.use(cors()); 


// ========== SOCKET.IO CORS ==========
const io = new Server(server, {
  cors: {
   origin: true,
    methods: ["GET","POST","PATCH","DELETE"]
  }
});

// =====================================
// CONNECT TO DB
// =====================================
ConnectToDataBase(DATABASE_URL)
  .then(() => console.log("Connected to database!!"))
  .catch((err) =>
    console.log(`Error connecting to DB: ${err}`)
  );

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/message", messageRouter);
app.use("/order", orderRouter);

// =====================================
// SOCKET.IO REAL TIME SYSTEM
// =====================================
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message, productId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
        productId,
        createdAt: new Date().toISOString(),
      });
    }

    socket.emit("messageSent", {
      receiverId,
      message,
      productId,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    for (let [uId, sId] of onlineUsers.entries()) {
      if (socket.id === sId) {
        onlineUsers.delete(uId);
        break;
      }
    }
  });
});

// =====================================
// SERVER START
// =====================================
const PORT = process.env.PORT;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT} successfully`)
);
