const express=require('express')
const signuser=require('../Controllers/usercontroller.js')

const router=express.Router()

router.get('/',(req,res)=>{
    res.send('Your on Landing page')
})

router.post('/login',signuser.login)
router.post('/signup',signuser.signup)
router.post('/join',signuser.joinRoom)
router.post('/initialjoin',signuser.initialJoin)
router.post('/create',signuser.createRoom)
router.post('/deleteroom',signuser.deleteRoom)
router.post('/removeuser',signuser.rmUser)
router.post('/getuinaroom',signuser.getUinRoom)
router.post('/banuser',signuser.banUser)
module.exports = router;
