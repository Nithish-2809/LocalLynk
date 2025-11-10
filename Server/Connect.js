const mongoose = require("mongoose")

const ConnectToDataBase = async(url)=> {
    await mongoose.connect(url)
} 

module.exports = ConnectToDataBase