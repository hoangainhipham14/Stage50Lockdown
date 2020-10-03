const express = require("express");
const router = express.Router();

const { updateUser, getUser, userByUsername } = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.post("/user/:username", updateUser);
router.get("/user/:username", getUser);

router.param("username", userByUsername);
module.exports = router;
