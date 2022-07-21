const express= require('express');
const app = express();
const router = express.Router()
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const registerSchema = require('../models/registermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const cont = require('../controller/controller')
const { findOne } = require('../models/registermodel');
const auth = require('../middleware/auth')
// const credential = require('../credential');



router.post('/register',cont.register);    
router.post('/login', cont.login);
router.post('/activate', cont.activate);
router.get('/token' , auth, cont.token);

module.exports = router
        