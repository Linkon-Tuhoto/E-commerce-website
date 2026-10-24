const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// ===============================
// GET MY WISHLIST
// ===============================

const getMyWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};

// ===============================
// ADD PRODUCT TO WISHLIST
// ===============================

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      await wishlist.populate("products");

      return res.status(200).json({
        message: "Product is already in wishlist",
        wishlist,
      });
    }

    wishlist.products.push(productId);

    await wishlist.save();

    await wishlist.populate("products");

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

// ===============================
// REMOVE PRODUCT FROM WISHLIST
// ===============================

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate("products");

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove product from wishlist",
      error: error.message,
    });
  }
};

// ===============================
// CLEAR WISHLIST
// ===============================

const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(200).json({
        message: "Wishlist already empty",
        wishlist: {
          products: [],
        },
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      message: "Wishlist cleared",
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};