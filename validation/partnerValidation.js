const { body } = require("express-validator");
const userModels = require("../models/userModel");

const partnerValidation = [
  // Name
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  // Email (required + valid + unique)
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(async (value) => {
      const user = await userModels.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  // Contact Number
  body("contactNo")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact number must be between 10 and 15 digits"),

  // Address
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
];

module.exports = { partnerValidation };
