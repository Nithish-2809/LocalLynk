const mongoose = require("mongoose")
const User = require("./User")

const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    age : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true,
        unique : true
    },
    description: {
        type: String,
        required : true
    },
    category: {
        type: String,
        default: "General"
    },

    Seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    status: {
        type: String,
        enum: ["available", "sold"],
        default: "available",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    }
},{timestamps : true})

productSchema.index({ location: "2dsphere" });

const Product = new mongoose.model("product",productSchema)

module.exports = Product