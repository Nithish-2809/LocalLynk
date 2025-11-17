const express = require("express")
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")
const {buyProduct,getMyOrders} = require("../Controllers/Order")
const orderRouter = express.Router()

orderRouter
.post("/buy/:productid",restrictToLoggedinUserOnly,buyProduct)
.get("/my-orders",restrictToLoggedinUserOnly,getMyOrders)


module.exports = orderRouter
