const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({

    
    email : {
        type: String,
        required : true,
       unique:true,
       
    },
    name : {
        type: String,
        require: true,
    },
    password : {
        type : String,
        require : true,

    },
    otp :{
        type: String,
        required : true,    
    },
    // token :{
    //     type: String, 
    //     required : true,     
    // },
    
    active :{
         type: 'Boolean',
         default: false,
}

});


module.exports = mongoose.model('login',registerSchema)

        
