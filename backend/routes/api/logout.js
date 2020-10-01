const logout = require("express").Router();
let User = require("../../models/user");
let UserSession = require("../../models/userSession");

logout.route("/").get((req, res) => {
  const { query } = req;
  const { token } = query;

  UserSession.findOneAndUpdate(
    {
      _id: token,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    null,
    (err, session) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error",
        });
      }
    }
  );

  return res.send({
    success: true,
    message: "Log out successfully",
  });
});

module.exports = logout;
