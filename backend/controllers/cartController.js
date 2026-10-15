const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ===============================
// GET MY CART
// ===============================

const getMyCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message,
    });
  }
};

// ===============================
// ADD TO CART
// ===============================

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      quantity = 1,
      size = "",
      color = {},
    } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Make sure product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check stock
    if (
      product.stockQuantity !== undefined &&
      product.stockQuantity <= 0
    ) {
      return res.status(400).json({
        message: "This product is out of stock",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check whether same product + size + color
    // already exists in cart

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color?.name === color?.name
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        size,
        color: {
          name: color?.name || "",
          value: color?.value || "",
        },
      });
    }

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE QUANTITY
// ===============================

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.quantity = Number(quantity);

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// ===============================
// REMOVE ITEM
// ===============================

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    item.deleteOne();

    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};

// ===============================
// CLEAR CART
// ===============================

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
        cart: {
          items: [],
        },
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};