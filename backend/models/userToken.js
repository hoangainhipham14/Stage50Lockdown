/* 
Generates a token based on the user when they sign up
so that the account can be confirmed through an email
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tokenSchema = Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200 
    }
});

const userToken = mongoose.model('token', tokenSchema);

module.exports = userToken;