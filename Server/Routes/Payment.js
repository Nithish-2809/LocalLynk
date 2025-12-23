const express = require("express");
const paymentRouter = express.Router();

const { restrictToLoggedinUserOnly } = require("../Middlewares/Auth");

const {
  createPayment,
  verifyPayment,
  failPayment,
} = require("../Controllers/Payment");

paymentRouter.post("/create", restrictToLoggedinUserOnly, createPayment);
paymentRouter.post("/verify", restrictToLoggedinUserOnly, verifyPayment);
paymentRouter.post("/fail", restrictToLoggedinUserOnly, failPayment);

module.exports = paymentRouter;
