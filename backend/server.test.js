// Test to see that the server is defined
const server = require("./server");

const { expect, assert } = require("chai");

describe("Server test", function () {
  it("app module exists", function () {
    assert.isDefined(server);
  });
});
