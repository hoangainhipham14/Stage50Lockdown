// For the email verification
///
var crypto = require('crypto');
var nodemailer = require('nodemailer');
///

const validation = require('express').Router();
let User = require('../../models/user.model');
let UserSession = require('../../models/userSession');
let UserToken = require('../../models/userToken');

validation.route('/').post((req, res) => {

    console.log('Validating user...');

    // Find a matching token
    UserToken.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
    });
        
    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send("The account has been verified. Please log in.");
        });
    });
});

module.exports = validation;