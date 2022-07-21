const express = require('express');
const speakeasy = require('speakeasy');
const uuid = require('uuid');
//adding node-json-db
const  JsonDB  = require('node-json-db').JsonDB;
const  Config  = require('node-json-db/dist/lib/JsonDBConfig').Config;
const db = new JsonDB(new Config("DataBase", true, false, '/'));
const qrcode = require('qrcode');
///const commons = require('commons');
const router = express.Router();


const authentication = ('/registered', (req, res) => {
  const id = uuid.v4();
  try {
    const path = `/user/${id}`;
    // Create temporary secret until it it verified
    const temp_secret = speakeasy.generateSecret();
    // Create user in the database
    db.push(path, { id, temp_secret });
    // Send user id and base32 key to user
    res.json({ id, secret: temp_secret.base32 })
  } catch(e) {
    console.log(e);
    res.status(500).json({ message: 'Error generating secret key'})
  }
})

const verify = ('/verify', (req, res) => {
    const { userId, token } = req.body;
    try {
      // Retrieve user from database
      const path = `/user/${userId}`;
      const user = db.getData(path);
      console.log({ user })
      const { base32: secret } = user.temp_secret;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
      });
      if (verified) {
        // Update user data
        db.push(path, { id: userId, secret: user.temp_secret });
        res.json({ verified: true })
      } else {
        res.json({ verified: false})
      }
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving user'})
    };
  })


const validate = ('/validate', (req, res) => {

    const {token, userId} = req.body;   
    try {
      // Retrieve user from database
      const path = `/user/${userId}`
      const user = db.getData(path)
    
      const { base32: secret } = user.secret;
      const tokenValidate = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token, 
        window:1 // time window 
      });
      
    
      if (tokenValidate) {  
        
        res.json({ validated: true })
      } else {
        res.json({ validated: false})
      }
    }catch(error) {
      console.error(error)
      res.status(500).json({ message: "Error retrieving user!"})
    };
  })

   //
//     name : 'wearedevs'
// });
// qrcode.toDataURL(secret.otpauth_url, function (err, data_url) {
//     console.log(data_url);
// })
// const base32secret = req.body.base32;
// const userToken = req.body.token;
// const verified = speakeasy.totp.verify({
//     secret: base32secret,
//     encoding: 'base32',
//     token: userToken
// });
// if (verified) {
//   db.enableTwoFactorAuthentication(email, base32secret);
//     res.status(200).send({
//         validated: true
//     });
// } else {
//     res.status(400).send({
//         validated: false
//     });
// }

// const validated = speakeasy.totp.verify({
//     secret: user.secret,
//     encoding: 'base32',
//     token: req.body.token,
// });
// res.code(200).send({ validated });

// })

//     const secret = speakeasy.generateSecret({
//         length: 10,
//         name: commons.userObject.uname,
//         issuer: 'NarenAuth v0.0'
//     });
//     var url = speakeasy.otpauthURL({
//         secret: secret.base32,
//         label: commons.userObject.uname,
//         issuer: 'NarenAuth v0.0',
//         encoding: 'base32'
//     });
//     QRCode.toDataURL(url, (err, dataURL) => {
//         commons.userObject.tfa = {
//             secret: '',
//             tempSecret: secret.base32,
//             dataURL,
//             tfaURL: url
//         };
//         return res.json({
//             message: 'TFA Auth needs to be verified',
//             tempSecret: secret.base32,
//             dataURL,
//             tfaURL: secret.otpauth_url
//         });
//     });


// const verify = ('/verify', (req, res) => {


//     console.log(`DEBUG: Received TFA Verify request`);

//     let isVerified = speakeasy.totp.verify({
//         secret: commons.userObject.tfa.tempSecret,
//         encoding: 'base32',
//         token: req.body.token
//     });

//     if (isVerified) {
//         console.log(`DEBUG: TFA is verified to be enabled`);

//         commons.userObject.tfa.secret = commons.userObject.tfa.tempSecret;
//         return res.send({
//             "status": 200,
//             "message": "Two-factor Auth is enabled successfully"
//         });
//     }

//     console.log(`ERROR: TFA is verified to be wrong`);

//     return res.send({
//         "status": 403,
//         "message": "Invalid Auth Code, verification failed. Please verify the system Date and Time"
//     });
// });

module.exports.authentication = authentication
module.exports.verify = verify
module.exports.validate = validate