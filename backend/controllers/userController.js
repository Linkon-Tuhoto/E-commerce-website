const User = require("../models/User");

// =====================================================
// GET ALL USERS
// =====================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// =====================================================
// GET ONE USER
// =====================================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);

    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
};