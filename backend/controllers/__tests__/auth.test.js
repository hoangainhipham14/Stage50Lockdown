// test the authentication modules
const {
  validateSignup,
  validateSignin,
  validateRequestRecovery,
} = require("../authValidation");

describe("Authentication Validation Tests -> validateSignup", function () {
  it("Should Reject A Signup Request with an invalid email", function () {
    const request1 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "notvalid",
      password: "testtesttesttest",
    };
    expect(validateSignup(request1)).toEqual({
      errors: { email: "Email is invalid" },
      isValid: false,
    });
  });
  it("Should Reject A Signin Request with a password that is too short", function () {
    const request2 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password: "te",
    };
    expect(validateSignup(request2)).toEqual({
      errors: { password: "Password must be at least 6 characters" },
      isValid: false,
    });
  });
  it("Should Reject A Signin Request with no first name", function () {
    const request3 = {
      firstName: "",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password: "testtesttesttest",
    };
    expect(validateSignup(request3)).toEqual({
      errors: { firstName: "First name is required" },
      isValid: false,
    });
  });
  it("Should Accept A Valid Signin Request", function () {
    const request4 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password: "testtesttesttest",
    };
    expect(validateSignup(request4)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});

describe("Authentication Validation Tests -> validateSignin", function () {
  it("Rejects a request with no password", function () {
    const request5 = { email: "valid@gmail.com", password: "" };
    expect(validateSignin(request5)).toEqual({
      errors: { password: "Password is required" },
      isValid: false,
    });
  });
  it("Checks Accepts a valid signin request", function () {
    const request6 = { email: "valid@gmail.com", password: "testtesttest" };
    expect(validateSignin(request6)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});

describe("Authentication Validation Tests -> validateRequestRecovery", function () {
  it("Checks For empty email", function () {
    const request7 = { email: "" };
    expect(validateRequestRecovery(request7)).toEqual({
      errors: { recoveryemail: "Email is required" },
      isValid: false,
    });
  });
  it("Checks for invalid email", function () {
    const request8 = {
      email: "@invalidbutalsocouldtrickasimplesystemvalid@gmail,com",
    };
    expect(validateRequestRecovery(request8)).toEqual({
      errors: { recoveryemail: "Email is invalid" },
      isValid: false,
    });
  });
  it("Allows valid email", function () {
    const request9 = { email: "valid@gmail.com" };
    expect(validateRequestRecovery(request9)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});

/*
const {
  signup,
  signin,
  signout,
  recoverPassword,
  requestRecovery,
  validation,
  resendValidation,
} = require("../auth");
*/

// Test that server is defined for it

// Test to see that the server is define

/*
const mongoose = require("mongoose");
const request = require("supertest");
const session = require("supertest-session");
const { expect, assert } = require("chai");
const { internet } = require("faker");
const { compare } = require("bcrypt");

const app = require("../../../app");
const UserModel = require("../user_model");
const testDB = "mongodb://localhost:27017/todo_tdd_test";
mongoose.Promise = global.Promise;

const server = require("./server");

describe("Server test", function () {
  it("app module exists", async function () {
    assert.isDefined(server);
  });
});

*/
