/*
I had to mode the validation files here as the auth file cannot be imported for testing due to
the async functions present
*/

const Validator = require("validator");
const isEmpty = require("is-empty");

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
  data.fbUserID = !isEmpty(data.fbUserID) ? data.fbUserID : "";
  data.image = !isEmpty(data.image) ? data.image : "";
  data.fbAccessToken = !isEmpty(data.fbAccessToken) ? data.fbAccessToken : "";

  // Regular Expression requirements
  const regexNum = new RegExp("(?=.*[0-9])");
  const regexLower = new RegExp("(?=.*[a-z])");
  const regexUpper = new RegExp("(?=.*[A-Z])");

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

  console.log("Checking: " + data.password);

  // validate password
  if (!Validator.isLength(data.password1, { min: 8 })) {
    errors.password1 = "Password must be at least 8 characters";
  } else if (
    !regexNum.test(data.password1) ||
    !regexLower.test(data.password1) ||
    !regexUpper.test(data.password1)
  ) {
    errors.password1 =
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
  }

  // Check they are the same password
  if (data.password1 != data.password2) {
    errors.password2 = "Passwords are not the same";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
}

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

module.exports.validateSignup = validateSignup;
module.exports.validateSignin = validateSignin;
module.exports.validateRequestRecovery = validateRequestRecovery;
