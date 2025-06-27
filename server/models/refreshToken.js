const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "7d" }, // Auto-delete expired tokens
  },
});

const refreshTokenModels = mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = refreshTokenModels;
