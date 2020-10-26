// Module imports
const express = require("express");
const router = express.Router();

// Controller imports
const { userSearch, projectSearch } = require("../controllers/search");

// Search for a user
router.post("/usersearch", userSearch);

// Search for a project
router.post("/projectsearch", projectSearch);

module.exports = router;
