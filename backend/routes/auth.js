const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  recoverPassword,
  requestRecovery,
  validation,
  resendValidation,
} = require("../controllers/auth");

// Sign up/in/out
router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", signout);

// Password recovery
router.post("/requestRecovery", requestRecovery);
router.post("/recoverPassword", recoverPassword);

// Email validation
router.get("/validation/:token", validation);
router.post("/resendValidation", resendValidation);

module.exports = router;
