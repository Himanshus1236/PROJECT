const express =require('express');
const app = express();
const router = express.Router()
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const registerSchema = require('../models/registermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const dotenv = require("dotenv");
require("dotenv").config();



  
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);


const register = async(req, res) =>{
    try{
    const password = req.body.password;
    const confirm_password = req.body.confirm_password

    if(password == confirm_password){
     const {  name, email, password , confirm_password} = req.body;

        if(!(name && email && password && confirm_password )){
            res.status(404).json('All input field is required');
        }
    } 
   //encryptedPassword = await bcrypt.hash(password, 10);
  //console.log('firstname,lastname,username,email,password,confirm_password', req.body.firstname,req.body.lastname,req.body.username,req.body.email,req.body.password,req.body.confirm_password)

  let User = new registerSchema({
    email : req.body.email,
    name : req.body.name,
    password : req.body.password,   
    otp : otp 
    
  })
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'himanshu.saraswat.551632',
        pass:'jwqdsokademvfrzh'  
    }
}); 
var Email = {
    from: 'himanshu.saraswat.551632@gmail.com',
    to: User.email,
    subject: `Hii ${User.name} your new OTP for login `,
    html: `<h1 style='font-weight:bold; color:#6e0031'>Hey ${User.name}</h1>
    <h3>Your accout login success!!<br> Please enter OTP </h3> 
    <h1 style='font-weight:bold; color:#260087;'>${otp.toString()}</h1>
    <br><p>Thank You! For using my company</p>`
};


transporter.sendMail(Email, function(error, info){

    
    if (error) {
        console.log(error);
    }
    else{
        console.log('Email sent: ' + info.response);
    }

    
});
    try{
    if(User.email == User.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)){
        const Users = await User.save();
        res.status(200).json({ Users , 
            message: 'registered succesully',
          Users 
        })     
    }else{
        res.status(404).json('email not valid')
    }
        
        
    }
catch(err){
        res.status(404).json({
            message :'not registered',
            err
        })
    }
   
}catch(err){
    res.status(404).json({
        message : 'invalid inputs',
        err
    });
}
};

const login = async(req, res) =>{
    try {       
        const { name, password , email } = req.body;
       // let {ActivationStatus} = req.params
        let condition = !!name ?{name : name} : {email : email}
    
         let user1 = await registerSchema.findOne(condition);
        
        
        if (!user1) return res.status(400).json({
            message : 'Incorrect username or email'
        })
       
        const validPassword =  await registerSchema.findOne({password});
    
        if (!validPassword) {return res.status(400).json({
            message : 'Please enter valid password'
        });
    }else{

         
         if(user1.active){
            const token = jwt.sign({user_id:user1._id , email}, process.env.TOKEN_KEY,{expiresIn:"2h"})
            user1.token = token
            res.status(200).json({
                message : 'User is succesfully Activated and token generated ',
                token
            })
         }else{
            res.status(404).json({
                message : 'User is not Activated, kindly activate the profile with valid OTP'
            })
         }
         
       
        }
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message : 'Something went wrong'
        });
      }
    }

 const activate =async(req, res, next) => {
        try {
            const { email, otp } = req.body;
        
            let user = await registerSchema.findOne({ email });
        
            if (!user) return res.status(400).send("Email not found");       
        
            const OTP =  await registerSchema.findOne({otp});
        
            if (!OTP) {
                return res.status(404).send({status : false, msg: 'otp not match activation unsucsesfull'});
            }else{
                let active = await registerSchema.updateOne({otp}, {$set: {active : true}})
                res.status(200).json({
                    message:'user is activated',
                    active
                })
            }   
            //at this point, login is successfull, return the user info without the password info
           // user.password = undefined;    
            res.status(200).json({
                status: true, message: 'data match activate succesfull' 
            });
          } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
          }
        };

        const token = async(req,res)=>{
            res.status(200).json({
                message : 'login succesful'
            })
        }

module.exports.register = register
module.exports.login = login
module.exports.activate = activate
module.exports.token = token
