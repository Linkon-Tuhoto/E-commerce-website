const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Basic information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Clothing", "Shoes", "Kitchen", "Household"],
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Unisex",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    // Product images
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return images.length > 0;
        },
        message: "At least one product image is required",
      },
    },

    // Sizes
    sizes: {
      type: [String],
      default: [],
    },

    // Colors
    colors: [
      {
        name: {
          type: String,
          required: true,
        },

        value: {
          type: String,
          required: true,
        },
      },
    ],

    // Stock
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // Customer ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Admin-controlled sections
    featured: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    // Search/filter tags
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);