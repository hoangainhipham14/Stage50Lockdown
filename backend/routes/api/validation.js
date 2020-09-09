const validation = require('express').Router();
let User = require('../../models/user.model');
let UserSession = require('../../models/userSession');
let UserToken = require('../../models/userToken');

validation.route('/').post((req, res) => {

    // The token is passed as a json file with a single element to verify the user
    // In we get time hopefully we can change this to happen automatically once the hyperlink is selected
    const userToken = req.body.token;
    //console.log('Validating user with token...' + userToken);

    // Find a matching token and hence the userId that is stored with the Token
    UserToken.findOne({token: req.body.token }, function (err, token) {
        if (!token) {
            return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token has expired.' });
        }
        else
        {
            //console.log("_userid referenced:" + token._userId);

            // If we have found a token, find a matching user using the _userid from the toke
            User.findOne({ _id: token._userId}, function (err, user) {

                // Invalid token cases
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (user.isValidated) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                // Verify and save the user
                user.isValidated = true;

                // Change this to a more efficient save function in the future
                user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
                });
            });
        }
    });
});

module.exports = validation;