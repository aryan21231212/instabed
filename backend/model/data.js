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
    password:{
        type: String,
        required:true,
        minlength: 5,}
})

const Data = mongoose.model("Data", Schema);


module.exports = Data