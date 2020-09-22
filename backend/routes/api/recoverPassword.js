const recoverPassword = require("express").Router();
let User = require("../../models/user.model");
let RecoveryToken = require("../../models/recoveryToken");

recoverPassword.route("/:token").get((req, res) => {
  // The token is passed as a json file with a single element to verify the user
  // In we get time hopefully we can change this to happen automatically once the hyperlink is selected
  const recoveryToken = req.params.token;
  //console.log('Validating user with token...' + userToken);

  // Find a matching token and hence the userId that is stored with the Token
  RecoveryToken.findOne({ token: req.params.token }, function (err, token) {
    if (!token) {
      return res.status(400).send({
        type: "not-verified",
        msg: "We were unable to find your recovery token. Your token has expired.",
      });
    } else {
      //console.log("_userid referenced:" + token._userId);

      // If we have found a token, find a matching user using the _userid from the toke
      User.findOne({ _id: token._userId }, function (err, user) {
        // Invalid token cases
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this recovery token." });


        // Change this to a more efficient save function in the future
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The account can now be recovered TBD........");
        });
      });
    }
  });
});

module.exports = recoverPassword;
