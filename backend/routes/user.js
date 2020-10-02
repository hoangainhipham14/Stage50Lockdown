const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/user");

const { requireAuthentication } = require("../controllers/auth");

router.post("/user/:username", createUser);

// router.param("username", userByUsername);
module.exports = router;
