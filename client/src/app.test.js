// Test to see that app is defined for the server
const app = require("./app");

const { expect, assert } = require("chai");

describe("Server test", function () {
  it("app module exists", function () {
    assert.isDefined(app);
  });
});
