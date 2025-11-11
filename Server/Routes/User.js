const express = require("express")
const {loginController,signupController} = require("../Controllers/User")
const userRouter = express.Router()


userRouter
.post('/login',loginController)
.post('/signup',signupController)

module.exports = userRouter