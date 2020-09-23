const recoverPassword = require("express").Router();
let User = require("../../models/user.model");
let RecoveryToken = require("../../models/recoveryToken");

recoverPassword.route("/:token").post((req, res) => {
  
    // With this recover password script, the user enters a new password, and the token is checked 
    // at the conclusion of this program whilst saving the passwords

  // Recovered from the URL
  const recoveryToken = req.params.token;

  // Passed as a json file
  const passwordNo1 = req.body.passwordNo1;
  const passwordNo2 = req.body.passwordNo2;
  
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

      // If we have found a token, we can now find the current password stored, and replace it
      // with the updated password

      User.findOne({ _id: token._userId }, function (err, user) {
        // Invalid token cases
        if (!user)
          return res
            .status(400)
            .send({ msg: "We were unable to find a user for this recovery token." });
        
        // Hash both passwords and if they match save one of them
        if(passwordNo1 == passwordNo2){
            user.password = user.generateHash(passwordNo1);
        }
        else{
            return res
            .status(400)
            .send({ msg: "Passwords do not match, please try again" });
        }

        // Change this to a more efficient save function in the future
        user.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send("The password has been changed....");
        });
      });
    }
  });
});

module.exports = recoverPassword;
