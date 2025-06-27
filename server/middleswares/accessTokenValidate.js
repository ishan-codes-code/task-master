const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenValidate = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    // console.log("Access Token Validation Error:", error);
    return res.status(401).json({ message: "Invalid token or token expired" });
  }
};

module.exports = { accessTokenValidate };
