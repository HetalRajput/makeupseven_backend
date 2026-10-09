const { validationResult } = require('express-validator');
const categoryModel = require('../models/categoryModel');
const path = require('path');

const add = async (req, res) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    }
  try {
    const { name } = req.body;

    let imageFilename = null;
    if (req.file && req.file.filename) {
      imageFilename = req.file.filename;
    }


    const newCategory = new categoryModel({
      name: name,
      imageUrl: imageFilename, // The file path or filename of the image
      status: 'active',
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json({
      message: 'Category created successfully',
      success: true,
      data: savedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
}


const getCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        const baseUrl = process.env.BASE_URL;
        
        const data = categories.map(cat => {
        const filename = cat.imageUrl || null;
        const imageUrl = filename ? `${baseUrl}/uploads/${filename}` : null;
            return {
                _id: cat._id,
                name: cat.name,
                imageUrl,
                status: cat.status,
            };
        });

        return res.status(200).json({
        success: true,
        data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

const categoryEdit = async (req, res) => {
  try {
    const { id } = req.body;
    const category = await categoryModel.findOne({ _id: id });

    if (!category) {
      return res.status(404).json({ message: 'Category not found', success: false });
    }
    const baseUrl = process.env.BASE_URL;

    const filename = category.imageUrl || null;
    const imageUrl = filename ? `${baseUrl}/uploads/${filename}` : null;

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: {
        name: category.name,
        imageUrl: imageUrl,
        status: category.status,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
}

const updateCategory = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    }

  try {
    const {id,name,status} = req.body;
    const updatedData = { name,status };

    if (req.file) {
      updatedData.imageUrl = req.file.filename; 
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found', success: false });
    }
    return res.status(200).json({
      message: 'Category updated successfully',
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getActiveCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ status: "active" });

    const baseUrl = process.env.BASE_URL;

    const data = categories.map(cat => {
      const filename = cat.imageUrl || null;
      const imageUrl = filename ? `${baseUrl}/uploads/${filename}` : null;

      return {
        _id: cat._id,
        name: cat.name,
        imageUrl,
        status: cat.status,
      };
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


module.exports = { add, getCategory,categoryEdit, updateCategory, getActiveCategories };