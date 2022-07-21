const dotenv = require("dotenv");
require("dotenv").config();
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const router  = express.Router()
const url = "mongodb+srv://Admin123:Admin123@cluster0.hoh9ymt.mongodb.net/?retryWrites=true&w=majority";
var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(express.json());

mongoose.connect(url)
 const con = mongoose.connection;

con.on('open', ()=>{
    console.log(' mongodb connected')
});

const sroutes = require('./routes/registerroute')
const mroutes = require('./routes/transactions')
const aroutes = require('./routes/authroute')
app.use('/route',sroutes)
app.use('/route',mroutes)
app.use('/route',aroutes)


app.listen('8080',()=>{
    console.log(' server run on 8080...')
})




