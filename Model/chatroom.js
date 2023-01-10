const mongoose = require("mongoose");

const Schema=mongoose.Schema

const roomSchema=new Schema({
    name:{type:String,required:true,unique:true,maxlength:15},
    password:{type: String,required:true,unique:true},
    admin: {type: String,required:true},
    people:[{name:{type:String,required:true}}],  
    chats: [{mesg:{type:String,required:true},name:{type:String,required:true}}],
    bannedUsers:[{name:{type:String,required:true}}]
})

const room = mongoose.model("room", roomSchema);
module.exports=room
