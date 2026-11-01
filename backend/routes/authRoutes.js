
const express = require("express");

const {
  register,
  login,
  createFirstAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// One-time protected setup for the first administrator.
router.post("/setup-admin", createFirstAdmin);

module.exports = router;