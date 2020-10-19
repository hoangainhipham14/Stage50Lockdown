const express = require("express");
const router = express.Router();

const {
  updateUser,
  getUser,
  userByUsername,
  getUsernameId,
  userPhoto,
} = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.post("/user/:username", requireAuthentication, updateUser);
router.get("/user/:username", requireAuthentication, getUser);
router.get("/user/:username/photo", requireAuthentication, userPhoto);
// router.post("/user/:username/photo", requireAuthentication, updateUserPhoto);

router.param("username", userByUsername);

router.get("/userId/:id", getUsernameId);
module.exports = router;
