const express = require("express")
const {addProduct,getAllproducts,getProductById} = require("../Controllers/Product")
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")

const productRouter = express.Router()

productRouter
.post('/',restrictToLoggedinUserOnly,addProduct)
.get('/',getAllproducts)
.get('/:id',getProductById)


module.exports = productRouter