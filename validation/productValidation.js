const { checkSchema } = require('express-validator');
const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel'); // 👈 add this

const productSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    },
    trim: true,
    custom: {
      options: async (value, { req }) => {
        const { categoryId } = req.body;

        // If category is missing, skip unique check
        if (!categoryId) return true;

        const existingProduct = await productModel.findOne({
          name: value,
          categoryId: categoryId
        });

        if (existingProduct) {
          throw new Error('Product name already exists in this category');
        }

        return true;
      }
    }
  },

  categoryId: {
    notEmpty: {
      errorMessage: 'Category is required'
    }
  },

  price: {
    notEmpty: {
      errorMessage: 'Price is required'
    },
    custom: {
      options: (value) => {
        if (isNaN(value) || Number(value) <= 0) {
          throw new Error('Price must be a valid number greater than 0');
        }
        return true;
      }
    }
  },

  description: {
    notEmpty: {
      errorMessage: 'Description is required'
    },
    isLength: {
      options: { max: 150 },
      errorMessage: 'Description must not exceed 150 characters'
    }
  },

  image: {
    custom: {
      options: (value, { req }) => {
        const { name, categoryId, price, description } = req.body;

        const hasEmptyField = [name, categoryId, price, description]
          .some(v => !v || (typeof v === 'string' && v.trim() === ''));

        if (hasEmptyField) return true;

        const file =
          req.file ||
          (req.files?.image && req.files.image[0]) ||
          (req.files?.productImage && req.files.productImage[0]);

        if (!file) {
          throw new Error('Image is required');
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error('Only JPG, JPEG and PNG images are allowed');
        }

        return true;
      }
    }
  }
});

module.exports = productSchema;
