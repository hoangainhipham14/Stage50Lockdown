const verify = require("express").Router();
let User = require("../../backend/models/user");
let UserSession = require("../../backend/models/userSession");

verify.route("/").get((req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.find({
    _id: token,
    isDeleted: false,
  })
    .then(() => {
      return res.send({
        success: true,
        message: "Verification succeeds",
      });
    })
    .catch((err, session) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }

      if (session.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid",
        });
      }
    });
});

module.exports = verify;
