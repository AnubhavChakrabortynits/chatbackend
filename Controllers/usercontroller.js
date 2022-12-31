
const User=require('../Model/user')
const Room=require('../Model/chatroom')
var CryptoJS = require("crypto-js");
const mongoose=require('mongoose')
const users=[];

const signup=async(req,res)=>{
    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true})

    try{
        const name=req.body.name
        const password=req.body.password
        const user=new User({name:name,password:CryptoJS.AES.encrypt(password,'secret key 123').toString()})
        await user.save()
        res.status(200).json({success:"true",user:user})
        
    }
    catch(e){
        console.log(e)
         res.status(200).json({error: "UserName Or Password is Already Taken"})
    }
    }

    const login=async(req,res)=>{

        await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
        useUnifiedTopology: true})
    
        const name=req.body.name
       
         const user=await User.findOne({name:name});
        // console.log(user,name)
         if(user==null){
            res.status(200).json({error:"No Such User"})
            return
         }

         if(CryptoJS.AES.decrypt(user?.password,'secret key 123').toString(CryptoJS.enc.Utf8)==req.body.password){
            res.status(200).json({success:"true",user:user})
         }
         else{
            res.status(200).json({error :"Wrong Password"})
         }
    }


    const createRoom=async(req,res)=>{
        await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
        useUnifiedTopology: true}) 

        try{
            const rname=req.body.room
            const rpassword=req.body.roompass
            const admin=req.body.name
            const ifRoomExits1= await  Room.findOne({name:rname})
            const ifRoomExits2= await  Room.findOne({password:rpassword})

            if(ifRoomExits1 || ifRoomExits2){
                res.status(200).json({error :"Room Already Exits.Try different Name and Password"})
                return
            }

            const room=new Room({name:rname,password:CryptoJS.AES.encrypt(rpassword,'secret key 123').toString(),admin:admin})
            room.people.push({name:admin})
            await room.save()

            res.status(200).json({success:"Room Created",room})
        }
        catch(e){
           // console.log(e)
        res.status(200).json({error: "Room with Same Name or Password Exists"})
        }
    }

const joinRoom=async(req,res)=>{

    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true})

    const name=req.body.name
    const room=req.body.room
    const roompass=req.body.roompass

    const reqroom=await Room.findOne({name:room})
    
    if(reqroom){
      //  console.log(CryptoJS.AES.decrypt(reqroom?.password,'secret key 123').toString(CryptoJS.enc.Utf8))
       if(CryptoJS.AES.decrypt(reqroom?.password,'secret key 123').toString(CryptoJS.enc.Utf8)!=roompass){
        res.status(200).json({error:'Invalid Password'})
        return
       }
       else{ 
        const existinguser=reqroom.people
        if(existinguser.find((user)=>user.name==name)){
            res.status(200).json({success:'Already In Room',room:reqroom})
            return
        }
        else{ 
            reqroom.people.push({name:name})
            await reqroom.save()
                res.status(200).json({success: 'Room Joined',room:reqroom})
                return
        }
       }
    }
    
        res.status(200).json({error:'No Such Room..U Can Create One.'})
    
}    



const initialJoin=async(req,res)=>{
    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true})
     
    const room=req.body.room 
    const reqroom=await Room.findOne({name:room})
    const chats=reqroom?.chats
    for(let i=0;i<chats.length;i++){
        chats[i].mesg=CryptoJS.AES.decrypt(chats[i]?.mesg,'secret key 123').toString(CryptoJS.enc.Utf8)
    }
    // console.log(chats)
    res.status(200).json({chats:chats})

}  




const rmUser=async(req,res)=>{
    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true})

    const room=await Room.findOne({name:req.body.room})
    if(!room){
        res.status(200).json({error:"User Could Not Be Deleted"})
       // console.log(room)
        return
    }
   
    
    const user=room.people.filter((user)=>user.name==req.body.name)[0]
    // console.log(user)
   
    
    if(user){
        room.people=room.people.filter((user)=>user.name!=req.body.name)
        await room.save()
        res.status(200).json({success:"true",room:room})
        return
    }
    else{ 
        res.status(200).json({error:'user could not be deleted'})
        return
    }

}


const deleteRoom=async(req,res)=>{

    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true})

    const room=await Room.findOneAndDelete({name:req.body.room})
    res.status(200).json({success:'true',room:room})

}


const getUinRoom=async(req,res)=>{
    await mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
    useUnifiedTopology: true}) 
    
   const users=await Room.findOne({name:req.body.room})
   res.status(200).json({users:users.people}) 

}

module.exports={rmUser,getUinRoom,signup,login,createRoom,joinRoom,initialJoin,deleteRoom}