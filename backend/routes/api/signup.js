// For the email verification
///
var crypto = require('crypto');
var nodemailer = require('nodemailer');
///

const signup = require('express').Router();
let User = require('../../models/user.model');
let UserSession = require('../../models/userSession');
let UserToken = require('../../models/userToken');

signup.route('/').post((req, res) => {

  console.log('signing up user')

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    email = req.body.email;

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

  // This is where the fun starts 
  console.log('Account being created...');
  newUser.save().catch(err => res.status(400).json('Error: ' + err));

  var token = new UserToken({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
  console.log('Token Generated....');

  // Save the verification token
  token.save().catch(err => res.status(500).send({ msgFromTokenSave: err.message })); 
  console.log('Token Saved....');

  // Create the email (With information from .env file)
  var transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
    user: process.env.GMAIL_USERNAME, 
    pass: process.env.GMAIL_PASSWORD 
    } 
  });
  console.log('Email Created....');

  // Specify the email contents
  var mailOptions = {
    from: 'noreply',
    to: newUser.email, 
    subject: 'Account Verification Token', 
    text: 'Verify your account by clicking the link (Will be required in the near future): \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' 
  };

  // Send the email
  /*
  transporter.sendMail(mailOptions, function (err) {
    if (err) { return res.status(500).send({ errMsgFromSendMail: err.message }); }
    console.log('Email Sent....');
    res.status(200).send('A verification email has been sent to ' + user.email + '.');
  });
  */
  transporter.sendMail(mailOptions).catch(err => res.status(500).send({ errMsgFromSendMail: err.message }));
  res.status(200).send('A verification email has been sent to ' + newUser.email + '.');
  console.log('Email Sent....');
  
});

module.exports = signup;
