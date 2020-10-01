var crypto = require("crypto");
var nodemailer = require("nodemailer");

const resendValidation = require("express").Router();
let User = require("../../models/user");
let UserSession = require("../../models/userSession");
let UserToken = require("../../models/userToken");

resendValidation.route("/").post((req, res) => {
  // The email is passed as a json file with a single element to verify the user
  const userEmail = req.body.email;

  // Find a matching user and hence the userId that is stored with the Token
  User.findOne({ email: userEmail }, function (err, user) {
    if (!user) {
      return res.status(400).send({
        type: "no-account",
        msg:
          "This user does not yet exist, please make an account with the signup feature",
      });
    } else if (user.isValidated) {
      return res.status(400).send({
        type: "already-verified",
        msg: "This user has already been verified",
      });
    } else {
      // Create another token and send it via email to the user
      var token = new UserToken({
        _userId: user._id,
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
        to: userEmail,
        subject: "Resent Account Verification Token",
        text:
          "Verify your account by clicking the link (Will be required in the near future): \nhttp://" +
          req.headers.host +
          "/api/validation/" +
          token.token,
      };

      // Send the email
      transporter
        .sendMail(mailOptions)
        .catch((err) =>
          res.status(500).send({ errMsgFromSendMail: err.message })
        );
      res
        .status(200)
        .send(
          "A verification email has been sent to " +
            userEmail +
            " with the resent Token."
        );
      console.log("Email Sent With A New Token....");
    }
  });
});

module.exports = resendValidation;
