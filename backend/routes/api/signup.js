// For the email verification
///
var crypto = require("crypto");
const isEmpty = require("is-empty");
var nodemailer = require("nodemailer");
const Validator = require("validator");
///

const signup = require("express").Router();
let User = require("../../models/user.model");
let UserSession = require("../../models/userSession");
let UserToken = require("../../models/userToken");

function validateUserData(data) {
  let errors = {};

  // convert empty fields to empty string for validator
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // validate first name
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name is required";
  }

  // validate last name
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name is required";
  }

  // validate username
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username is required";
  }

  // validate email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // validate password
  if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

signup.route("/").post((req, res) => {

  // validate user info
  const { errors, isValid } = validateUserData(req.body);

  // 400 BAD REQUEST if invalid user info
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // EXTRACT SIGN UP INFORMATION

  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const username = req.body.username;
  var email = req.body.email.toLowerCase();
  const password = req.body.password;

  // Check duplicate email
  User.findOne({email:email}).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      User.findOne({username:username}).then(user => {
        if (user) {
          return res.status(400).json({
            username: "Username taken"
          });
        } else {
          
          // Create new user
          const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
          });
          newUser.password = newUser.generateHash(password);

          // Send verification email
          var token = new UserToken({
            _userId: newUser._id,
            token: crypto.randomBytes(16).toString("hex"),
          });

          // Save the verification token
          token
            .save()
            .catch((err) =>
              res.status(500).send({ msgFromTokenSave: err.message })
            );

          // Create the email (With information from .env file)
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.GMAIL_USERNAME,
              pass: process.env.GMAIL_PASSWORD,
            },
          });

          // Specify the email contents
          var mailOptions = {
            from: "noreply",
            to: newUser.email,
            subject: "Account Verification Token",
            text:
              "Verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/api/users/validation/" +
              token.token,
          };

          // Send the email
          transporter
            .sendMail(mailOptions)
            .catch((err) =>
              res.status(500).send({ errMsgFromSendMail: err.message })
            );


          // Save user
          console.log("Saving user...");
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        }
      })
    }
  })
});

module.exports = signup;
