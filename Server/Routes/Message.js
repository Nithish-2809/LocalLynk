const express = require("express")
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")
const {storeMessage,chatHistory,myChats,markAsRead} = require("../Controllers/Message")

const messageRouter = express.Router()

messageRouter
.post('/store',restrictToLoggedinUserOnly,storeMessage)
.get('/history/:userid',restrictToLoggedinUserOnly,chatHistory)
.get("/my-chats", restrictToLoggedinUserOnly, myChats)
.patch("/read",restrictToLoggedinUserOnly, markAsRead);

module.exports = messageRouter