const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const cardSchema = mongoose.Schema({
    card_number : {
        type : String,
        unique : true
    },
    pin : {
        type : String,
        unique : true,
        default : ''
    },
    balance : {
        type : String,
        unique : true,
        default : ''
    }
});




module.exports = mongoose.model('Cards',cardSchema);