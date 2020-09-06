const signin = require('express').Router();
let User = require('../../models/user.model');
let UserSession = require('../../models/userSession');

signin.route('/').post((req, res) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    email = req.body.email;
    const password = req.body.password;

    if (!firstname) {
        return res.send({
            success: false,
            message: "First name is required"
        });
    }

    if (!lastname) {
        return res.send({
            success: false,
            message: "Last name is required"
        });
    }

    if (!email) {
        return res.send({
            success: false,
            message: "Email is required"
        });
    }

    if (!password) {
        return res.send({
            success: false,
            message: "Password is required"
        });
    }

    email = email.toLowerCase();

    User.find({
        email: email,
    }, (err, users) => {
        if (users.length != 1) {
            return res.send({
                success: false,
                message: "Error: Invalid"})
        } else if (err) {
            return res.end("Error: invalid email")
        }

        const user = users[0];
        
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: "Error: invalid password"})
        }

        //correct user
        const userSession = new UserSession();
        userSession.userId = user._id;

        userSession.save()
        .then(() => res.json({
            message: 'Signed in!',
            token: user._id}))
        .catch(err => res.status(400).json('Error: ' + err));
    });
});

module.exports = signin;
