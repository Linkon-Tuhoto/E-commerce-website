
const express = require("express");

const {
  getUsers,
  getUserById,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

router.get("/:id", protect, adminOnly, getUserById);

module.exports = router;
