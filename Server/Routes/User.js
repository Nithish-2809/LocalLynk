const express = require("express")
const {loginController,signupController,getProductsByUser} = require("../Controllers/User")
const userRouter = express.Router()
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")


userRouter
.post('/login',loginController)
.post('/signup',signupController)
.get('/:userId',getProductsByUser)

userRouter.get("/profile",restrictToLoggedinUserOnly, (req, res) => {
  res.json({
    msg: "Authorized successfully!",
    user: req.user,
  });
});

module.exports = userRouter