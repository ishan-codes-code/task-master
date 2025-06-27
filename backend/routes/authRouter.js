const { signup, login, logout } = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../middleswares/authValidation");
const { refreshAccessToken } = require("../controllers/refreshAccessToken");

const authRouter = require("express").Router();

authRouter.post("/signup", signupValidation, signup);
authRouter.post("/login", loginValidation, login);
authRouter.post("/refresh", refreshAccessToken);
authRouter.post("/logout", logout);
module.exports = authRouter;
