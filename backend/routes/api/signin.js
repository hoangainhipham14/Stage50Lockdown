const signin = require("express").Router();
const isEmpty = require("is-empty");
const Validator = require("validator");

let User = require("../../models/user.model");
let UserSession = require("../../models/userSession");

function validate(data) {
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

signin.route("/").post((req, res) => {
  // validate user info
  const { errors, isValid } = validate(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    // check user exists
    if (!user) {
      return res.status(400).json({ emailnotfound: "Email not found" });
    }

    // check password
    if (!user.validPassword(password)) {
      return res.status(400).json({ passwordincorrect: "Incorrect password" });
    }

    // check verified account
    if (!user.isValidated) {
      return res
        .status(400)
        .json({
          notvalidated:
            "Your account has not yet been verified. Please check your email (including your spam folder) for instructions.",
        });
    }

    const userSession = new UserSession();
    userSession.userId = user._id;

    userSession
      .save()
      .then(() =>
        res.json({
          success: true,
          token: user._id,
        })
      )
      .catch((err) =>
        res.status(400).json({
          error: err,
        })
      );
  });
});

module.exports = signin;
