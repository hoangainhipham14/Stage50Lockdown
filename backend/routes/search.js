// Module imports
const express = require("express");
const router = express.Router();

// Controller imports
const { userSearch } = require("../controllers/search");

// Search for a user
router.post("/usersearch", userSearch);

module.exports = router;
