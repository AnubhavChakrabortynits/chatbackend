const express=require('express')
const app=express()
var CryptoJS = require("crypto-js");
const Room=require('./Model/chatroom')
const socketio=require('socket.io')
const http = require('http');
const router=require('./Router/router')
const server=http.createServer(app);
const io=socketio(server)
const cors=require('cors')
const mongoose=require('mongoose')

app.use(express.json()); 
app.use(cors())

mongoose.connect("mongodb://localhost:27017/Chat",{ useNewUrlParser: true,
useUnifiedTopology: true})

io.on('connection',(socket)=>{
        socket.on('join',async({name,room,roompass})=>{
      
        socket.join(room)
  
        const users=await Room.findOne({name:room})
        socket.to(room).emit('mesg',{mesg:`${name} joined room --${room}`,name:name,type:'userjoined',room:room,users:users.people})
    })
       
      socket.on('mesg',async({name,room,mesg})=>{
       // console.log(mesg,name)
        if(mesg=='Room Deleted'){
          socket.to(room).emit('mesg',{mesg:mesg,room:room,name:name,type:'roomdeleted'})
          return 
        }

        if(mesg=='User Removed'){
          io.to(room).emit('mesg',{mesg:`Admin Removed ${name} From The Room`,room:room,name:name,type:'userremoved'})
          return
        }

        if(mesg=='User Banned'){
          io.to(room).emit('mesg',{mesg:`Admin Banned ${name} From The Room`,room:room,name:name,type:'userbanned'})
          return
        }

        if(mesg=="User Left"){
          io.to(room).emit('mesg',{mesg:`${name} Has Left The Room`,room:room,name:name,type:'userleft'})
          return
        }

        const findroom=await Room.findOne({name:room})
        findroom.chats.push({mesg:CryptoJS.AES.encrypt(mesg,'secret key 123').toString(),name:name}) 
        
        await findroom.save() 
        io.to(room).emit('mesg',{mesg:mesg,room:room,name:name,type:'chat'})
        })

      socket.on('disconnect',({name,room})=>{
        io.to(room).emit('mesg',{type:'userleft',mesg:`${name} has left room --${room}`})
      })

     socket.on('create',({name,room,roompass})=>{
        socket.join(room)
        io.sockets.in(room).emit('roomcreated',`${name} created the room --${room}`)
     })
  
})



app.use(router)


server.listen(5000,()=>{console.log('up and running')}) 