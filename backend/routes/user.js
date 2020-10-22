const express = require("express");
const router = express.Router();

const {
  updateUser,
  getUser,
  userByUsername,
  getUsernameId,
  userPhoto,
  getUserAccountDetails,
} = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.get("/user/account/:username", requireAuthentication, getUserAccountDetails);

router.post("/user/:username", requireAuthentication, updateUser);
router.get("/user/:username", getUser);
router.get("/user/:username/photo", userPhoto);
// router.post("/user/:username/photo", requireAuthentication, updateUserPhoto);

router.param("username", userByUsername);

router.get("/userId/:id", getUsernameId);
module.exports = router;
