const express = require("express");

const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Every cart operation requires login

router.get("/", protect, getMyCart);

router.post("/", protect, addToCart);

router.put("/:itemId", protect, updateCartItem);

router.delete("/:itemId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;