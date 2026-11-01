const express = require("express");

const {
  createOrder,
  initiateOrderPayment,
  initiateTransportPayment,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateTransportFee,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Customer operations
router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.post("/:id/pay", protect, initiateOrderPayment);

router.post("/:id/pay-transport", protect, initiateTransportPayment);

// Admin operations
router.get("/", protect, adminOnly, getOrders);

router.put("/:id/transport", protect, adminOnly, updateTransportFee);

router.put("/:id/status", protect, adminOnly, updateOrderStatus);

// Get one order: controller must verify customer ownership.
router.get("/:id", protect, getOrderById);

module.exports = router;
