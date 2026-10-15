const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const {
  initiateMpesaPayment,
} = require("../services/intasendService");

const normalizePhoneNumber = (phone) => {
  if (!phone) return "";

  let cleaned = String(phone)
    .replace(/\s+/g, "")
    .replace(/-/g, "");

  if (cleaned.startsWith("+254")) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith("0")) {
    cleaned = `254${cleaned.substring(1)}`;
  }

  return cleaned;
};

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const {
      items,
      deliveryAddress,
      paymentMethod = "M-PESA",
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.county ||
      !deliveryAddress.town ||
      !deliveryAddress.area
    ) {
      return res.status(400).json({
        message: "County, town and area are required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Customer account not found",
      });
    }

    const orderItems = [];

    for (const item of items) {
      if (!item.product) {
        return res.status(400).json({
          message: "Product ID is missing",
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }

      if (!product.inStock) {
        return res.status(400).json({
          message: `${product.name} is currently out of stock`,
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (
        typeof product.stockQuantity === "number" &&
        quantity > product.stockQuantity
      ) {
        return res.status(400).json({
          message: `Only ${product.stockQuantity} units of ${product.name} are available`,
        });
      }

      if (
        Array.isArray(product.sizes) &&
        product.sizes.length > 0 &&
        item.size &&
        !product.sizes.includes(item.size)
      ) {
        return res.status(400).json({
          message: `Invalid size selected for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: Number(product.price),
        quantity,
        size: item.size || "",
        color: item.color || "",
      });
    }

    const subtotal = orderItems.reduce(
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Transport is added later by admin.
    const deliveryFee = 0;

    const totalAmount = subtotal + deliveryFee;

    const orderNumber = `MAM-${Date.now()}`;

    const order = await Order.create({
      orderNumber,

      customer: user._id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,

      deliveryAddress: {
        county: deliveryAddress.county.trim(),
        town: deliveryAddress.town.trim(),
        area: deliveryAddress.area.trim(),
        building: deliveryAddress.building?.trim() || "",
        directions: deliveryAddress.directions?.trim() || "",
      },

      items: orderItems,

      subtotal,
      deliveryFee,
      totalAmount,

      // Product payment
      productPaymentStatus: "PENDING",
      productPaymentReference: "",
      productPaymentPhone: "",

      // Transport has not been set yet
      transportPaymentStatus: "NOT_SET",
      transportPaymentReference: "",
      transportPaymentPhone: "",

      // Legacy fields
      paymentStatus: "PENDING",
      paymentReference: "",
      paymentPhone: "",

      orderStatus: "PENDING",
      paymentMethod,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// =====================================================
// INITIATE PRODUCT PAYMENT
// =====================================================

const initiateOrderPayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Customer can only pay for their own order
    if (
      !order.customer ||
      order.customer.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot pay for this order",
      });
    }

    if (order.productPaymentStatus === "PAID") {
      return res.status(400).json({
        message:
          "The products for this order have already been paid for",
      });
    }

    const {
      phoneNumber: paymentPhone,
    } = req.body;

    if (
      !paymentPhone ||
      !String(paymentPhone).trim()
    ) {
      return res.status(400).json({
        message: "M-PESA phone number is required",
      });
    }

    const phoneNumber =
      normalizePhoneNumber(paymentPhone);

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid Kenyan phone number. Please use a number such as 0712345678.",
      });
    }

    const amount = Number(order.subtotal);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid product payment amount",
      });
    }

    const apiRef =
      `${order.orderNumber}-PRODUCT`;

    const intasendResponse =
      await initiateMpesaPayment({
        amount,
        phoneNumber,
        apiRef,
      });

    const invoiceId =
      intasendResponse?.invoice?.invoice_id || "";

    order.productPaymentStatus = "PROCESSING";
    order.productPaymentReference = invoiceId;
    order.productPaymentPhone = phoneNumber;

    // Legacy fields
    order.paymentStatus = "PROCESSING";
    order.paymentReference = invoiceId;
    order.paymentPhone = phoneNumber;
    order.paymentMethod = "M-PESA";

    await order.save();

    return res.status(200).json({
      message:
        "M-PESA product payment prompt sent successfully",

      order,

      payment: {
        invoiceId,

        state:
          intasendResponse?.invoice?.state ||
          "PENDING",

        provider:
          intasendResponse?.invoice?.provider ||
          "M-PESA",

        amount,
      },
    });
  } catch (error) {
    console.error("Product payment error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Unable to initiate product payment",
    });
  }
};

// =====================================================
// INITIATE TRANSPORT PAYMENT
// =====================================================

const initiateTransportPayment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      !order.customer ||
      order.customer.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot pay for this order",
      });
    }

    // Product must be paid first
    if (order.productPaymentStatus !== "PAID") {
      return res.status(400).json({
        message:
          "Please pay for the products before paying for transport",
      });
    }

    const transportFee =
      Number(order.deliveryFee);

    if (!transportFee || transportFee <= 0) {
      return res.status(400).json({
        message: "Transport fee has not been set yet",
      });
    }

    if (
      order.transportPaymentStatus === "PAID"
    ) {
      return res.status(400).json({
        message: "Transport has already been paid for",
      });
    }

    const {
      phoneNumber: paymentPhone,
    } = req.body;

    if (
      !paymentPhone ||
      !String(paymentPhone).trim()
    ) {
      return res.status(400).json({
        message: "M-PESA phone number is required",
      });
    }

    const phoneNumber =
      normalizePhoneNumber(paymentPhone);

    if (!/^254(7|1)\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Invalid Kenyan phone number. Please use a number such as 0712345678.",
      });
    }

    order.totalAmount =
      Number(order.subtotal) + transportFee;

    const apiRef =
      `${order.orderNumber}-TRANSPORT`;

    const intasendResponse =
      await initiateMpesaPayment({
        amount: transportFee,
        phoneNumber,
        apiRef,
      });

    const invoiceId =
      intasendResponse?.invoice?.invoice_id || "";

    order.transportPaymentStatus =
      "PROCESSING";

    order.transportPaymentReference =
      invoiceId;

    order.transportPaymentPhone =
      phoneNumber;

    await order.save();

    return res.status(200).json({
      message:
        "M-PESA transport payment prompt sent successfully",

      order,

      payment: {
        invoiceId,

        state:
          intasendResponse?.invoice?.state ||
          "PENDING",

        provider:
          intasendResponse?.invoice?.provider ||
          "M-PESA",

        amount: transportFee,
      },
    });
  } catch (error) {
    console.error(
      "Transport payment error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Unable to initiate transport payment",
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

const getOrders = async (req, res) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "approvedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Failed to fetch orders:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        customer: req.user.id,
      })
        .populate(
          "customer",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Failed to fetch customer orders:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

// =====================================================
// GET ONE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "======================================"
    );

    console.log("GET ORDER BY ID");
    console.log("Order ID:", id);
    console.log(
      "User:",
      req.user?._id || req.user?.id
    );
    console.log(
      "User role:",
      req.user?.role
    );

    console.log(
      "======================================"
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    /*
      IMPORTANT:

      We intentionally do not populate customer
      or approvedBy here.

      The order already contains:

      customerName
      customerEmail
      customerPhone

      This keeps this endpoint simple and
      avoids populate-related failures.
    */

    const order =
      await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(
      "======================================"
    );

    console.error(
      "GET ORDER BY ID ERROR"
    );

    console.error(error);

    console.error(
      "======================================"
    );

    return res.status(500).json({
      message: "Failed to fetch order",

      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

// =====================================================
// UPDATE TRANSPORT FEE
// =====================================================

const updateTransportFee = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const {
      deliveryFee,
    } = req.body;

    const fee = Number(deliveryFee);

    if (
      !Number.isFinite(fee) ||
      fee < 0
    ) {
      return res.status(400).json({
        message:
          "Transport fee must be a valid amount greater than or equal to 0",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.transportPaymentStatus ===
      "PAID"
    ) {
      return res.status(400).json({
        message:
          "Transport fee cannot be changed after transport has been paid",
      });
    }

    order.deliveryFee = fee;

    order.totalAmount =
      Number(order.subtotal) + fee;

    if (fee === 0) {
      order.transportPaymentStatus =
        "NOT_SET";

      order.transportPaymentReference =
        "";

      order.transportPaymentPhone =
        "";
    } else {
      order.transportPaymentStatus =
        "PENDING";

      order.transportPaymentReference =
        "";

      order.transportPaymentPhone =
        "";
    }

    await order.save();

    return res.status(200).json({
      message:
        "Transport fee updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Failed to update transport fee:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update transport fee",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const {
      orderStatus,
    } = req.body;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REJECTED",
    ];

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus =
      orderStatus;

    if (
      orderStatus === "APPROVED"
    ) {
      order.approvedAt =
        new Date();

      order.approvedBy =
        req.user.id;
    }

    await order.save();

    return res.status(200).json({
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Failed to update order status:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update order status",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  initiateOrderPayment,
  initiateTransportPayment,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateTransportFee,
};