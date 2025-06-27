const jwt = require("jsonwebtoken");
const refreshTokenModels = require("../models/refreshToken"); // Assuming your model file

const refreshAccessToken = async (req, res) => {
  try {
    // console.log(req.cookies);
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided." });
    }

    // Check if refresh token exists in DB
    const storedToken = await refreshTokenModels.findOne({
      token: refreshToken,
    });
    if (!storedToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token." });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token." });
    }

    // Generate a new access token (15 min expiry)
    const accessToken = jwt.sign(
      { email: decoded.email, _id: decoded._id },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ success: true, accessToken });
  } catch (err) {
    console.error("Error in refreshAccessToken:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { refreshAccessToken };
