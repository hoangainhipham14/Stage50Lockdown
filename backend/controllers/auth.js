// Model imports
const User = require("../models/user");
const UserToken = require("../models/userToken");
const UserSession = require("../models/userSession");
const RecoveryToken = require("../models/recoveryToken");

// Library imports
const crypto = require("crypto");
const isEmpty = require("is-empty");
const nodemailer = require("nodemailer");
const Validator = require("validator");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

// Validate the input to the sign up form.
// Works in isolation - does not consider duplicate email etc.
function validateSignup(data) {
  let errors = {};

  // convert empty fields to empty string for validator
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password1 = !isEmpty(data.password1) ? data.password1 : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // validate first name
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Required";
  }

  // validate last name
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Required";
  }

  // validate username
  if (Validator.isEmpty(data.username)) {
    errors.username = "Required";
  }

  // validate email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid email";
  }

  // validate password
  // regex for password
  const regexNum = new RegExp("(?=.*[0-9])");
  const regexLower = new RegExp("(?=.*[a-z])");
  const regexUpper = new RegExp("(?=.*[A-Z])");

  if (!Validator.isLength(data.password1, { min: 8 })) {
    errors.password1 = "Password must be at least 8 characters";
  } else if (
    !regexNum.test(data.password1) ||
    !regexLower.test(data.password1) ||
    !regexUpper.test(data.password1)
  ) {
    // console.log(
    //   !regexNum.test(data.password1),
    //   !regexLower.test(data.password1),
    //   !regexUpper.test(data.password1)
    // );
    errors.password1 =
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
  } else if (data.password1 !== data.password2) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// async function is the only change from the previous implementation.
// async means we don't need an enormous nested mess.
exports.signup = async (req, res) => {
  // validate sign up data
  const { errors, isValid } = validateSignup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { firstName, lastName, username } = req.body;
  const email = req.body.email.toLowerCase();
  const password = req.body.password1;

  // check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({
      email: "Email already exists",
    });
  }
  // check if username already exists
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({
      email: "Username taken",
    });
  }

  // create new user
  const newUser = new User({ firstName, lastName, username, email });
  newUser.password = newUser.generateHash(password);

  // send verification email
  var token = new UserToken({
    _userId: newUser._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  // Save the verification token
  token
    .save()
    .catch((err) => res.status(500).send({ msgFromTokenSave: err.message }));

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
    subject: "Account Verification Token (Updated)",
    text:
      "Verify your account by clicking the link: \nhttp://" +
      req.headers.host +
      "/api/validation/" +
      token.token,
  };

  // Send the email
  transporter
    .sendMail(mailOptions)
    .catch((err) => res.status(500).send({ errMsgFromSendMail: err.message }));

  // Save user
  console.log("Saving user...");
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
};

// Validate the input to the sign in form.
function validateSignin(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// Checks correct sign in details
exports.signin = (req, res) => {
  // validate sign in data
  const { errors, isValid } = validateSignin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    // check user exists
    if (!user) {
      return res.status(400).json({ email: "Email not found" });
    }

    // check password
    if (!user.validPassword(password)) {
      return res.status(400).json({ passwordincorrect: "Incorrect password" });
    }

    // check verified account
    if (!user.isValidated) {
      return res.status(400).json({
        notvalidated:
          "Your account has not yet been verified. Please check your email (including your spam folder) for instructions.",
      });
    }

    const userSession = new UserSession();
    userSession.userId = user._id;
    userSession
      .save()
      .catch((err) => console.log("Error saving user session:", err));

    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // use cookie to store token
    // expiry = current epoch time (seconds) + length of year
    const expiry = Date.now() / 1000 + 31556926;
    res.cookie("token", token, { expiry });

    // respond with token and also a subset of the user information
    const { _id, firstName, lastName, username, email } = user;
    // console.log("responding...");
    return res.json({
      token,
      user: { _id, firstName, lastName, username, email },
    });
  });
};

// Password recovery
exports.recoverPassword = (req, res) => {
  // With this recover password script, the user enters a new password, and the token is checked
  // at the conclusion of this program whilst saving the passwords

  const recoveryToken = req.body.token;

  // Passed as a json file
  const passwordNo1 = req.body.passwordNo1;
  const passwordNo2 = req.body.passwordNo2;

  const regexNum = new RegExp("(?=.*[0-9])");
  const regexLower = new RegExp("(?=.*[a-z])");
  const regexUpper = new RegExp("(?=.*[A-Z])");

  if (passwordNo1.length < 8) {
    return res.status(400).send({
      msg: "Password must be at least 8 characters long",
    });
  } else if (
    !regexNum.test(passwordNo1) ||
    !regexLower.test(passwordNo1) ||
    !regexUpper.test(passwordNo1)
  ) {
    // console.log(
    //   !regexNum.test(passwordNo1),
    //     !regexLower.test(passwordNo1),
    //     !regexUpper.test(passwordNo1)
    // );
    return res.status(400).send({
      msg:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  //console.log('Validating user with token...' + userToken);

  // Find a matching token and hence the userId that is stored with the Token
  RecoveryToken.findOne({ token: recoveryToken }, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: "not-verified",
        msg:
          "We were unable to find your recovery token. Your token has expired.",
      });
    } else {
      //console.log("_userid referenced:" + token._userId);

      // If we have found a token, we can now find the current password stored, and replace it
      // with the updated password

      User.findOne({ _id: token._userId }, function (err, user) {
        // Invalid token cases
        if (!user)
          return res.status(400).send({
            msg: "We were unable to find a user for this recovery token.",
          });

        // Hash both passwords and if they match save one of them
        if (passwordNo1 == passwordNo2) {
          user.password = user.generateHash(passwordNo1);
        } else {
          return res
            .status(400)
            .json({ msg: "Passwords do not match, please try again" });
        }

        // Change this to a more efficient save function in the future
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The password has been changed....");
        });
      });
    }
  });
};

// Checks for email in database
function validateRequestRecovery(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";

  // email checks
  if (Validator.isEmpty(data.email)) {
    errors.recoveryemail = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.recoveryemail = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

// Sends password recovery email
exports.requestRecovery = (req, res) => {
  const { errors, isValid } = validateRequestRecovery(req.body);

  if (!isValid) {
    console.log("Not valid!");
    return res.status(400).json(errors);
  }

  // The email is passed as a json file with a single element to verify the user
  const userEmail = req.body.email.toLowerCase();

  // Find a matching user and hence the userId that is stored with the Token
  User.findOne({ email: userEmail }, function (err, user) {
    if (!user) {
      return res.status(400).send({
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
      console.log("Recovery Token Generated....");

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
          "/resetPassword/" +
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
        .json({ msg: "Email has been sent. Please check your inbox" });
      console.log("Email Sent With A recovery Token....");
    }
  });
};

// Sends a new verification email
exports.resendValidation = (req, res) => {
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
};

// Signs user out of the app
exports.signout = (req, res) => {
  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    null,
    (err, session) => {
      if (err) {
        return res.status(500).json({
          error: "Server error",
        });
      }
    }
  );

  res.clearCookie("token");
  return res.json({
    success: true,
  });
};

// Checks for user's validation
exports.validation = (req, res) => {
  // The token is passed as a json file with a single element to verify the user
  // In we get time hopefully we can change this to happen automatically once the hyperlink is selected
  const userToken = req.params.token;
  //console.log('Validating user with token...' + userToken);

  // Find a matching token and hence the userId that is stored with the Token
  UserToken.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: "not-verified",
        msg: "We were unable to find a valid token. Your token has expired.",
      });
    } else {
      //console.log("_userid referenced:" + token._userId);

      // If we have found a token, find a matching user using the _userid from the toke
      User.findOne({ _id: token._userId }, function (err, user) {
        // Invalid token cases
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this token." });
        if (user.isValidated)
          return res.status(400).send({
            type: "already-verified",
            msg: "This user has already been verified.",
          });

        // Verify and save the user
        user.isValidated = true;

        // Change this to a more efficient save function in the future
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The account has been verified. Please log in.");
        });
      });
    }
  });
};

// User verification
exports.verify = (req, res) => {
  const { query } = req;
  const { token } = query;

  // Searches database for user's token
  UserSession.find({
    _id: token,
    isDeleted: false,
  })
    .then(() => {
      return res.send({
        success: true,
        message: "Verification succeeds",
      });
    })
    .catch((err, session) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }

      if (session.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid",
        });
      }
    });
};

exports.requireAuthentication = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});
