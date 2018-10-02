const mongoose = require('mongoose');

const atm = mongoose.Schema({
    hundreds : {
        type : Number,
        unique : true
    },
    fivehundred : {
        type : Number,
        
    },
    twothousand : {
        type : Number
    }
    
});

module.exports = mongoose.model('Atm', atm);