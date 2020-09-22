/* 
Generates a token based on the user when they sign up
so that the account can be confirmed through an email
*/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recoveryTokenSchema = Schema({
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
        // Set 5 min expiration time to reduce risk
        expires: 300 
    }
});

const recoveryToken = mongoose.model('RecoveryToken', recoveryTokenSchema);

module.exports = recoveryToken;