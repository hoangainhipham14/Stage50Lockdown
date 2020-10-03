/*
I had to mode the validation files here as the auth file cannot be imported for testing due to
the async functions present
*/

const Validator = require("validator");
const isEmpty = require("is-empty");

// Validate the input to the sign up form.
// Works in isolation - does not consider duplicate email etc.
export function validateSignup(data) {
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
    isValid: isEmpty(errors),
  };
}

// Validate the input to the sign in form.
export function validateSignin(data) {
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

export function validateRequestRecovery(data) {
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
