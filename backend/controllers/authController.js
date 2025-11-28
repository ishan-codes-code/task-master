const userModels = require("../models/user");
const refreshTokenModels = require("../models/refreshToken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModels.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists. You can Login",
      });
    }
    const userModel = new userModels({
      name,
      email,
      password,
    });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Always perform bcrypt.compare() to prevent timing attacks
    const dummyHash = "$2b$10$abcdefghijklmnopqrstuvwxyz123456"; // Dummy hash to compare if user doesn't exist
    const user = await userModels.findOne({ email });

    if (!user) {
      await bcrypt.compare(password, dummyHash); // Prevents timing attack
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate tokens with longer access token expiry
    const accessToken = jwt.sign(
      { name: user.name, email: user.email, _id: user._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" } // Increased from 1 minute
    );

    const refreshToken = jwt.sign(
      { name: user.name, email: user.email, _id: user._id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Delete any existing refresh token for the user before saving a new one
    await refreshTokenModels.deleteMany({ userId: user._id });

    const refreshTokenInstance = new refreshTokenModels({
      userId: user._id,
      token: refreshToken,
      expiresAt: expiresAt,
    });

    await refreshTokenInstance.save();

    // Secure cookie settings, allowing HTTP during development
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Secure in production
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      userId: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    await refreshTokenModels.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "Lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
