// some basic tests for the user controller
const {
    updateUser,
    userByUsername,
    getUsernameId,
    userPhoto,
    getUserAccountDetails,
    getUserProfile,
    getEditProfileDetails,
  } = require("../user");

  // Check they are all defined
  describe("User Tests -> Check the files exist", function () {
    it("should recognise all the functions exist", function () {
        expect(updateUser);
        expect(userByUsername);
        expect(getUsernameId);
        expect(userPhoto);
        expect(getUserAccountDetails);
        expect(getUserProfile);
        expect(getEditProfileDetails);
    });
  });