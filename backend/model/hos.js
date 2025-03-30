const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    Phone:{
        type: String,
        required:true,
    },
    id:{
        type:String,
        required:true,
    },
    symptoms:{
        type:String,
        
    }


})

const User = mongoose.model("User", Schema);


module.exports = User;