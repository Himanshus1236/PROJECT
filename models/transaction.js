const mongoose = require('mongoose');

const transactionSchema =  mongoose.Schema({
  
    sender:{

        type : String,
        require : true
    },
     private_key:{


        type : String,
        require : true
    },
    receiver:{

        type : String,
        require : true
    },
   amount:{

        type : String,
        require : true
    },
    email : {
        type: String,
        required : true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

},
{
    timestamps : true,

    },
    
   
        
);
        
      


module.exports = mongoose.model('Transaction', transactionSchema)