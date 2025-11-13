const express = require("express")
const {addProduct,getAllProducts,getProductById,updateProduct,deleteProduct,searchProducts,getNearbyProducts,getMyProducts} = require("../Controllers/Product")
const {restrictToLoggedinUserOnly} = require("../Middlewares/Auth")

const productRouter = express.Router()

productRouter
.post('/',restrictToLoggedinUserOnly,addProduct)
.get('/',getAllProducts)
.get('/near',getNearbyProducts)
.get('/my-products',restrictToLoggedinUserOnly,getMyProducts)
.get('/:id',getProductById)
.patch('/:id',restrictToLoggedinUserOnly,updateProduct)
.delete('/:id',restrictToLoggedinUserOnly,deleteProduct)
.get("/search", searchProducts)


module.exports = productRouter