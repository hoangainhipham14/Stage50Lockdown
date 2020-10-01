const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/project");
const { requireAuthentication } = require("../controllers/auth");

router.post("/project/create/:userID", requireAuthentication, createProject);

module.exports = router;
