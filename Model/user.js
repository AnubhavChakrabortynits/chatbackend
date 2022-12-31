const mongoose = require("mongoose");

const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{type:String,required:true,unique:true,maxlength:15},
    password:{type: String,required:true,unique:true}
})

const User = mongoose.model("user", userSchema);
module.exports=User
 