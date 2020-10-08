const express = require("express");
const router = express.Router();

const {
  updateUser,
  getUser,
  userByUsername,
  getUsernameId,
} = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.post("/user/:username", requireAuthentication, updateUser);
router.get("/user/:username", requireAuthentication, getUser);

router.param("username", userByUsername);

router.get("/userId/:id", getUsernameId);
module.exports = router;
