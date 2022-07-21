const express = require('express');
var moment = require('moment')
const router = express.Router()
require('dotenv').config(); 
const Web3 = require('web3');
//const Tx = require('ethereumjs-tx').Transaction;
const web3eth = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
 require('dotenv').config();
 const transactionSchema = require('../models/transaction')
 //require('./config/database').connect() 
const privateKey = '2f9313c08c79288833e10bb0df31f87bbe642af51cfba82dfd42670b88b6fd71';
const mongoose = require('mongoose');
const { nextTick } = require('process');
const nodemailer = require('nodemailer');
//const jwt = require('jsonwebtoken');
var time = require('moment-timezone') 
var time1 = time.tz("Asia/calcutta").format("DD-MM-YYYY HH:mm:ss")



const showtransaction =  async (req, res, next) =>{
    transactionSchema.find().then((result) =>{
        res.send(result)
    }).catch((error) =>{
        res.send(error)
    })
}

const transaction = async (req, res, next) => {
    try{
       let transaction =  transactionSchema( 
      {sender, receiver, amount, email } = req.body,
       console.log(sender, receiver, amount, email  , 'hello'))
       
        const gasLimit = await web3eth.eth.estimateGas({
           from: sender,
           to: receiver,
           value: web3eth.utils.toWei(amount.toString(), 'ether'),
        })
        console.log(gasLimit, 'limit is set')
     
        const value = web3eth.utils.toWei(amount.toString(), "ether");
        const gasPrice = await web3eth.eth.getGasPrice();
     
        const transactionFee = gasPrice * gasLimit;
     
           amount = value - transactionFee;
     
        console.log(amount, gasPrice, gasLimit, transactionFee, amount, 'cool')
     
        const ETHTransaction = await web3eth.eth.accounts.signTransaction(
            // time.tz("Asia/calcutta").format("DD-MM-YYYY HH:mm:ss"),
           {
              from: sender,
              to: receiver,
              value: amount,
              gasLimit: gasLimit,
              
           },
           privateKey
        );
        const ETHReceipt = await web3eth.eth.sendSignedTransaction(ETHTransaction.rawTransaction)
        try {
            const mail = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                user:'himanshu.saraswat.551632',
                pass:'jwqdsokademvfrzh',
                },
              });
          
              const Email = {
                from:'himanshu.saraswat.551632@gmail.com',
                to: transaction.email,
                subject: `Hii ${transaction.sender} your new reciept for transaction `,
                html: `<h1 style='font-weight:bold; color:#6e0031'>Hey ${
                  transaction.sender
                }</h1>
                  <h3>Your accout login success!!<br> your transaction reciept</h3> 
                  <h1 style='font-weight:bold; color:#260087;'>${transaction}</h1>
                  <br><p>Thank You! For using my company</p>`,
              };
          
              mail.sendMail(Email, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            const t1 = transaction.save()
            res.status(200).json({message : 'email has been sent', ETHReceipt}) 
        } catch (error) {
            res.status(404).json({
                Message :'Unable to save transaction :',
                error
            })
            
       
        console.log(`Transaction Successful With Hash For ETH: ${ETHReceipt.transactionHash}`)
        console.log(ETHReceipt);
        res.send(ETHReceipt)
        
     
        return ETHReceipt;
     }
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message : 'Transaction failed!',
    
        })
    }
       
       }


    const balance = async (req, res, next) => {
        const { sender } = req.body;
        try {
            const balance = web3eth.utils.fromWei(
                await web3eth.eth.getBalance(sender)
            );
            res.status(200).json({
                Message : 'Balance fetched successfully!',
                Account_Number : sender,
                Balance : balance
            })
        } catch (Error) {
            res.status(404).json({ Message : 'Account not found!' })
            console.log(Error) 
        }
    }

    module.exports.showtransaction = showtransaction
    module.exports.transaction = transaction
    module.exports.balance = balance

   