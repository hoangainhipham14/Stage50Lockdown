const express = require("express");
const router = express.Router();

const {
  updateUser,
  //getUser,
  userByUsername,
  getUsernameId,
  userPhoto,
  getUserAccountDetails,
  getUserProfile,
  getEditProfileDetails,
} = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.get("/user/account/:username", requireAuthentication, getUserAccountDetails);
router.get("/user/profile/:username", getUserProfile);
router.get("/user/createProfile/:username", requireAuthentication, getEditProfileDetails)
router.post("/user/:username", requireAuthentication, updateUser);

//router.get("/user/:username", getUser);
router.get("/user/:username/photo", userPhoto);

router.param("username", userByUsername);

router.get("/userId/:id", getUsernameId);
module.exports = router;
