// Project functions
const {
    userSearch,
  } = require("../search");
  // Check they are all defined
  describe("Project Validation Tests -> Check the files exist", function () {
    it("should recognise all the functions exist", function () {
      expect(userSearch);
    })

});