const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const transactionSchema = mongoose.Schema({
    cardnumber : {
        type : String,
         },
    withdrawalAmount : {
        type : String
        
    }
});




module.exports = mongoose.model('Transaction',transactionSchema);
module.exports.createTransaction = function(newuser, callback) {
    

    
    newuser.save(callback);

};