const express = require("express")
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")
const {storeMessage,chatHistory} = require("../Controllers/Message")

const messageRouter = express.Router()

messageRouter
.post('/store',restrictToLoggedinUserOnly,storeMessage)
.get('/history/:userid',restrictToLoggedinUserOnly,chatHistory)

module.exports = messageRouter