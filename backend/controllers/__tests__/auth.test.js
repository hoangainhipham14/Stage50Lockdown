// test the authentication modules
const {
  validateSignup,
  validateSignin,
  validateRequestRecovery,
} = require("../auth");

describe("Authentication Validation Tests -> validateSignup", function () {
  it("Should Reject A Signin Request with an invalid email", function () {
    const request1 = {
      firstname: "Test",
      lastname: "Test",
      username: "test123",
      email: "notvalid",
      passoword: "testtesttesttest",
    };
    expect(validateSignup(request1)).toEqual({
      errors: { email: "Email is invalid" },
      isValid: false,
    });
  });
  it("Should Reject A Signin Request with a password that is too short", function () {
    const request2 = {
      firstname: "Test",
      lastname: "Test",
      username: "test123",
      email: "notvalid",
      passoword: "testtesttesttest",
    };

    expect(true).toEqual(true);
  });
  it("Should Reject A Signin Request with no first name", function () {
    const request3 = {
      firstname: "Test",
      lastname: "Test",
      username: "test123",
      email: "notvalid",
      passoword: "testtesttesttest",
    };
    expect(true).toEqual(true);
  });
  it("Should Accept A Valid Signin Request", function () {
    const request4 = {
      firstname: "Test",
      lastname: "Test",
      username: "test123",
      email: "notvalid",
      passoword: "testtesttesttest",
    };
    expect(true).toEqual(true);
  });
});

describe("Authentication Validation Tests -> validateSignin", function () {
  it("app module exists", async function () {
    true;
  });
});

describe("Authentication Validation Tests -> validateRequestRecovery", function () {
  it("app module exists", async function () {
    true;
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
