// test the authentication modules
const {
  validateSignup,
  validateSignin,
  validateRequestRecovery,
} = require("../authValidation");

describe("Authentication Validation Tests -> validateSignup", function () {

  it("Should Reject A Signup Request a second password that does not match the first", function () {
    const request1 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "notvalid",
      password1: "testtesttesttest",
      password2: "testtesttesttestdsafsfdsfdsfdsf",
    };
    expect(validateSignup(request1)).toEqual({
      errors: { email: "Emails dont match" },
      isValid: false,
    });
  });


  it("Should Reject A Signup Request with an invalid email", function () {
    const request2 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "notvalid",
      password1: "testtesttesttest",
      password2: "testtesttesttest",
    };
    expect(validateSignup(request2)).toEqual({
      errors: { email: "Email is invalid" },
      isValid: false,
    });
  });
  it("Should Reject A Signup Request with a password that is too short", function () {
    const request3 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password1: "te",
      password1: "te",
    };
    expect(validateSignup(request3)).toEqual({
      errors: { password1: "Password must be at least 8 characters" },
      isValid: false,
    });
  });
  it("Should Reject A Signin Request with no first name", function () {
    const request4 = {
      firstName: "",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password1: "testtesttesttest",
      password2: "testtesttesttest",
    };
    expect(validateSignup(request4)).toEqual({
      errors: { firstName: "First name is required" },
      isValid: false,
    });
  });
  it("Should Accept A Valid Signin Request", function () {
    const request5 = {
      firstName: "Test",
      lastName: "Test",
      username: "test123",
      email: "valid@gmail.com",
      password1: "testtesttesttest",
      password2: "testtesttesttest",
    };
    expect(validateSignup(request5)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});

describe("Authentication Validation Tests -> validateSignin", function () {
  it("Rejects a request with no password", function () {
    const request6 = { email: "valid@gmail.com", password: "" };
    expect(validateSignin(request6)).toEqual({
      errors: { password: "Password is required" },
      isValid: false,
    });
  });
  it("Checks Accepts a valid signin request", function () {
    const request7 = { email: "valid@gmail.com", password: "testtesttest" };
    expect(validateSignin(request7)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});

describe("Authentication Validation Tests -> validateRequestRecovery", function () {
  it("Checks For empty email", function () {
    const request8 = { email: "" };
    expect(validateRequestRecovery(request8)).toEqual({
      errors: { recoveryemail: "Email is required" },
      isValid: false,
    });
  });
  it("Checks for invalid email", function () {
    const request9 = {
      email: "@invalidbutalsocouldtrickasimplesystemvalid@gmail,com",
    };
    expect(validateRequestRecovery(request9)).toEqual({
      errors: { recoveryemail: "Email is invalid" },
      isValid: false,
    });
  });
  it("Allows valid email", function () {
    const request10 = { email: "valid@gmail.com" };
    expect(validateRequestRecovery(request10)).toEqual({
      errors: {},
      isValid: true,
    });
  });
});