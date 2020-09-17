// For the email verification
///
var crypto = require("crypto");
var nodemailer = require("nodemailer");
///

const signup = require("express").Router();
let User = require("../../models/user.model");
let UserSession = require("../../models/userSession");
let UserToken = require("../../models/userToken");

signup.route("/").post((req, res) => {
  // EXTRACT SIGN UP INFORMATION

  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const password = req.body.password;
  const username = req.body.username;
  email = req.body.email;

  // VALIDATE SIGN UP INFORMATION

  if (!firstname) {
    return res.send({
      success: false,
      message: "First name is required",
    });
  }

  if (!lastname) {
    return res.send({
      success: false,
      message: "Last name is required",
    });
  }

  if (!username) {
    return res.send({
      success: false,
      message: "Username is required",
    });
  }

  if (!email) {
    return res.send({
      success: false,
      message: "Email is required",
    });
  }

  if (!password) {
    return res.send({
      success: false,
      message: "Password is required",
    });
  }

  email = email.toLowerCase();

  // proceed only if email is not already in database
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.send({
        success: false,
        message: "Email already exists",
      });
    } else {
      // CREATE NEW USER

      const newUser = new User();
      newUser.firstname = firstname;
      newUser.lastname = lastname;
      newUser.username = username;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);

      // SEND EMAIL VALIDATION

      var token = new UserToken({
        _userId: newUser._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      //console.log('Token Generated....');

      // Save the verification token
      token
        .save()
        .catch((err) =>
          res.status(500).send({ msgFromTokenSave: err.message })
        );
      //console.log('Token Saved....');

      // Create the email (With information from .env file)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      //console.log('Email Created....');

      // Specify the email contents
      var mailOptions = {
        from: "noreply",
        to: newUser.email,
        subject: "Account Verification Token",
        text:
          "Verify your account by clicking the link (Will be required in the near future): \nhttp://" +
          req.headers.host +
          "/users/validation/\n and entering the token: " +
          token.token,
      };

      // Send the email
      transporter
        .sendMail(mailOptions)
        .catch((err) =>
          res.status(500).send({ errMsgFromSendMail: err.message })
        );

      // SAVE THE NEW USER

      newUser.save((err, user) => {
        if (err) {
          res.send({
            success: false,
            message: "Error: Server error",
          });
          console.log("Server error when saving:", err.message);
        } else {
          res.send({
            success: true,
            message:
              "A verification email has been sent to " + newUser.email + ".",
          });
          console.log("Email Sent....");
        }
      });
    }
  });
});

module.exports = signup;
