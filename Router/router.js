const express=require('express')
const signuser=require('../Controllers/usercontroller.js')

const router=express.Router()

router.get('/',(req,res)=>{
    res.send('Your on Landing page')
})

router.post('/login',signuser.login)
router.post('/signup',signuser.signup)
router.post('/join',signuser.authenticate,signuser.joinRoom)
router.post('/initialjoin',signuser.authenticate,signuser.initialJoin)
router.post('/create',signuser.authenticate,signuser.createRoom)
router.post('/deleteroom',signuser.deleteRoom)
router.post('/removeuser',signuser.rmUser)
router.post('/getuinaroom',signuser.getUinRoom)
router.post('/banuser',signuser.banUser) 
router.post('/onroompage',signuser.onRoomPage) 

module.exports = router; 
  