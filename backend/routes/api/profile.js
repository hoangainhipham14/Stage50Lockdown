const profile = require("express").Router();
let User = require("../../models/user.model");

profile.route("/:username").get((req, res) => {
  const username = req.params.username;

  // Search for profile matching username parameter
  User.findOne({ username: username }, (err, user) => {
    if (!user) {
      res.send("User could not be found");
    } else {
      res.json(user);
    }
  });
});

module.exports = profile;
