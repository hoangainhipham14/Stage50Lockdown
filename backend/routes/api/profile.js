const profile = require("express").Router();
let User = require("../../models/user.model");

profile.route("/:username").get((req, res) => {
  const username = req.params.username;

  // Search for profile matching username parameter
  User.findOne({ username: username }, (err, user) => {
    if (!user) {
      res.send({
        success: false,
        message: "Profile does not exist",
      });
    } else {
      res.send({
        success: true,
        message: "Profile exists",
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
      });
    }
  });
});

module.exports = profile;
