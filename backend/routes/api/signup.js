const signup = require('express').Router();
let User = require('../../models/user.model');
let UserSession = require('../../models/userSession');

signup.route('/').post((req, res) => {
    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const password = req.body.password;
    email = req.body.email;

    console.log(firstname, lastname, email, password);

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
  }).catch((err, preUsers) => {
    if (preUsers.length > 0) {
        return res.end("Error: Account already exists")
    } else {
      res.end("Error");
    }
  });

  const newUser = new User();
  newUser.firstname = firstname;
  newUser.lastname = lastname;
  newUser.email = email;
  newUser.password = newUser.generateHash(password);

  // newUser.save()
  // .then(() => res.json('Signed up!'))
  // .catch(err => res.status(400).json('Error: ' + err));

  newUser.save((err, user) => {
    if (err) {
      res.send({
        success: false,
        message: "Error: Server error"
      });
    }
    res.send({
      success: true,
      message: "Signed up"
    });
  });
});

module.exports = signup;
