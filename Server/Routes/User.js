const express = require("express");
const { loginController, signupController, getProductsByUser,updateProfile } = require("../Controllers/User");
const upload = require("../utils/Multer")
const { restrictToLoggedinUserOnly } = require("../Middlewares/Auth");

const userRouter = express.Router();

userRouter
  .post('/login', loginController)
  .post('/signup', upload.single("profilePic"), signupController)   
  .get('/:userId', getProductsByUser)
  .patch('/:userId',upload.single("profilePic"),updateProfile);

userRouter.get("/profile", restrictToLoggedinUserOnly, (req, res) => {
  res.json({
    msg: "Authorized successfully!",
    user: req.user,
  });
});

module.exports = userRouter;
