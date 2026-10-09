const categoryModel = require('../models/categoryModel');
const { body, check } = require('express-validator');

const categoryValidation = [
  // name: required + unique
  body('name')
    .notEmpty()
    .withMessage('Name field cannot be empty')
    .bail()
    .custom(value => {
      return categoryModel.findOne({ name: value }).then(cat => {
        if (cat) {
          return Promise.reject('Category name already in use');
        }
      });
    }),

  // image: required and must be jpeg/jpg/png
  check('image').custom((value, { req }) => {
    const file =
      req.file ||
      (req.files && req.files.profileImage && req.files.profileImage[0]) ||
      (req.files && req.files.image && req.files.image[0]) ||
      null;

    if (!file) {
      throw new Error('Image is required');
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.mimetype)) {
      throw new Error('Only jpeg, jpg and png images are allowed');
    }

    return true;
  })
];

module.exports = { categoryValidation };