const express = require('express'),
    router = express.Router();

const multer  = require('multer');
const upload = multer();
const UserModel = require('../../models/User');
const bcrypt = require('bcryptjs');

router.post("/register",upload.none(),async (req,res)=>{
    const {username,email,password}=req.body;
    if(/@yactraq./.test(email)){
    let user = await UserModel.findOne({username});
    if (user){
        return res.status(401).json({message: "User Already Exists",target: 'user_already_exists'});
    }
    const hashedPass = await bcrypt.hash(password,12);
    user = new UserModel({
        username,
        email,
        password: hashedPass
    });
    await user.save();
    res.status(200).json({message: "Registration Successful",target: "/login"})
  }else{
    return res.status(401).json({message: "This is for internal purposes only",target: 'not_internal'})
  }
  })
 
router.get("/isLoggedIn",(req,res)=>{
    if(req.session && req.session.isAuth){
        res.status(200).json({message: true})
    }
    else{
        res.status(200).json({message: false})
    }
})  
router.post("/login",upload.none(), async (req,res)=>{
    const {username,password} = req.body;
  
    const user = await UserModel.findOne({username});
  
    if(!user){
        return res.status(401).json({message: 'User Does not Exist',target: 'no_user_exists'})
    }
  
    const isMatch = await bcrypt.compare(password,user.password);
  
    if(!isMatch){
        return res.status(401).json({message: 'Wrong Password',target: 'wrong_password'})
    }
    req.session.isAuth = true;
    req.session.userId = user.username;
    res.status(200).json({message: 'Success',target: '/transcripts'})
  });
  
router.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if (err) throw err;
        res.redirect("/");
    });
  });
  
module.exports = router;