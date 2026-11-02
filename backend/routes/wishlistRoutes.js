const express = require("express");

const {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyWishlist);

router.post("/", protect, addToWishlist);

router.delete("/:productId", protect, removeFromWishlist);

router.delete("/", protect, clearWishlist);

module.exports = router;