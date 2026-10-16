const mongoose = require("mongoose");

// =====================================================
// DELIVERY ADDRESS
// =====================================================

const deliveryAddressSchema = new mongoose.Schema(
  {
    county: {
      type: String,
      required: true,
      trim: true,
    },

    town: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    building: {
      type: String,
      default: "",
      trim: true,
    },

    directions: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// ORDER ITEM
// =====================================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Price captured at the time the order was created.
    // This protects the order if the product price changes later.
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// ORDER
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    // =================================================
    // ORDER NUMBER
    // =================================================

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // =================================================
    // CUSTOMER
    // =================================================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      default: "",
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // DELIVERY ADDRESS
    // =================================================

    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },

    // =================================================
    // PRODUCTS
    // =================================================

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,

        message:
          "An order must contain at least one item.",
      },
    },

    // =================================================
    // MONEY
    // =================================================

    // Product amount only.
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // Transport starts at zero.
    // Admin can set this later.
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // subtotal + deliveryFee
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // PRODUCT PAYMENT
    // =================================================

    productPaymentStatus: {
      type: String,

      enum: [
        "PENDING",
        "PROCESSING",
        "PAID",
        "FAILED",
        "REJECTED",
        "REFUNDED",
      ],

      default: "PENDING",

      index: true,
    },

    productPaymentReference: {
      type: String,
      default: "",
      trim: true,
    },

    productPaymentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // TRANSPORT PAYMENT
    // =================================================

    // NOT_SET means the admin has not assigned
    // a transport fee yet.

    transportPaymentStatus: {
      type: String,

      enum: [
        "NOT_SET",
        "PENDING",
        "PROCESSING",
        "PAID",
        "FAILED",
        "REJECTED",
        "REFUNDED",
      ],

      default: "NOT_SET",

      index: true,
    },

    transportPaymentReference: {
      type: String,
      default: "",
      trim: true,
    },

    transportPaymentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // LEGACY PAYMENT FIELDS
    // =================================================
    // Keep these temporarily so existing frontend code
    // and older orders do not immediately break.
    //
    // The new payment system should use:
    // productPayment*
    // transportPayment*
    //
    // These fields can be removed later after the
    // frontend and webhook have completely migrated.

    paymentStatus: {
      type: String,

      enum: [
        "PENDING",
        "PROCESSING",
        "PAID",
        "FAILED",
        "REJECTED",
        "REFUNDED",
      ],

      default: "PENDING",

      index: true,
    },

    paymentMethod: {
      type: String,
      default: "",
      trim: true,
    },

    paymentReference: {
      type: String,
      default: "",
      trim: true,
    },

    paymentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // ORDER STATUS
    // =================================================

    orderStatus: {
      type: String,

      enum: [
        "PENDING",
        "APPROVED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REJECTED",
      ],

      default: "PENDING",

      index: true,
    },

    // =================================================
    // ADMIN
    // =================================================

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// INDEXES
// =====================================================

// Customer's order history
orderSchema.index({
  customer: 1,
  createdAt: -1,
});

// Admin order filtering
orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});

// Payment filtering
orderSchema.index({
  productPaymentStatus: 1,
  transportPaymentStatus: 1,
  createdAt: -1,
});

// =====================================================
// EXPORT
// =====================================================

module.exports = mongoose.model(
  "Order",
  orderSchema
);