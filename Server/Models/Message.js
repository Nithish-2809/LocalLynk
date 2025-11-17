const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    message : {
        type : String,
    }
},{timestamps : true})

const Message = new mongoose.model("message",messageSchema)

module.exports = Message