const Joi = require("joi");

// Reusable validation schema for signup
const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 50 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  password: Joi.string()
  .trim()
  .min(6)
  .max(100)
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 100 characters",
  }),

});

// Reusable validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
  }),
  password: Joi.string().trim().min(6).max(100).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must not exceed 100 characters",
  }),
});

// Generic validation function
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: "failed",
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

// Export validation middleware
module.exports = {
  signupValidation: validate(signupSchema),
  loginValidation: validate(loginSchema),
};
