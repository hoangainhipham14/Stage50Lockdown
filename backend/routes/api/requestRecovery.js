var crypto = require("crypto");
var nodemailer = require("nodemailer");

const requestRecovery = require("express").Router();
let User = require("../../models/user.model");
let RecoveryToken = require("../../models/recoveryToken");

requestRecovery.route("/").post((req, res) => {

  // The email is passed as a json file with a single element to verify the user
  const userEmail = req.body.email;

  // Find a matching user and hence the userId that is stored with the Token
  User.findOne({ email: userEmail }, function (err, user) {
    if (!user) {
      return res
        .status(400)
        .send({
          type: "no-account",
          msg:
            "This user does not yet exist, please make an account with the signup feature",
        });
    } else {

      // Create another token and send it via email to the user
      var recoveryToken = new RecoveryToken({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      console.log('Recovery Token Generated....');

      // Save the verification token
      recoveryToken
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
        subject: "Recover Account",
        text:
          "Recover your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/api/recovery/recoverPassword" +
          recoveryToken.token +
          "\nNote that this link expires in 5 minutes.",
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
          "A recovery email has been sent to " +
            userEmail +
            " with the recoveryToken."
        );
      console.log("Email Sent With A recovery Token....");
    }
  });
});

module.exports = requestRecovery;
