let mongoose = require('mongoose');
let schema = mongoose.Schema;
let hexCodeVerification = Math.floor(Math.random() * 900000) + 100000;
let user = new schema( {
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        unique: true,
        required: true,
    },
    activated : {
        type: Boolean,
        default: false,
    },

    hexCode: {
        default: hexCodeVerification,
        type: Number,
        required: true,

    }
})

module.exports = mongoose.model('user', user);