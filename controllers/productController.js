const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const { validationResult } = require('express-validator');

const add = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const { name, categoryId, discountPrice, title, price, description, productQuantity, status } = req.body;
    
    let imageFilename = null;
    if (req.file?.filename) {
      imageFilename = req.file.filename;
    } else if (req.files?.image?.[0]) {
      imageFilename = req.files.image[0].filename;
    }

    const product = await productModel.create({
      name,
      title,
      categoryId,
      discountPrice,
      price,
      description,
      imageUrl: imageFilename,
      productQuantity,
      status
    });

    return res.status(201).json({
      message: 'Product created successfully',
      success: true,
      data: product
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}


const get = async (req, res) => {
    try {
        const product = await productModel.find().populate('categoryId', 'name');

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const data = product.map(pro => {
        const filename = pro.imageUrl || null;
        const imageUrl = filename ? `${baseUrl}/uploads/${filename}` : null;
            return {
                _id: pro._id,
                name: pro.name,
                Category: pro.categoryId.name,
                price: pro.price,
                description: pro.description,
                discountPrice: pro.discountPrice,
                productQuantity: pro.productQuantity,
                status: pro.status,
                title: pro.title,
                imageUrl,
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

const edit = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filename = product.imageUrl || null;
    const imageUrl = filename ? `${baseUrl}/uploads/${filename}` : null;

    return res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: {
        id: product._id,
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        discountPrice: product.discountPrice,
        title: product.title,
        description: product.description,
        productQuantity: product.productQuantity,
        status: product.status,
        imageUrl: imageUrl,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
}

const update = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }
  try {
    const { id, name, categoryId, discountPrice, title, price, description, productQuantity, status } = req.body;
    const product = await productModel.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found', success: false });
    }

    let imageFilename = product.imageUrl;
    if (req.file?.filename) {
      imageFilename = req.file.filename;
    } else if (req.files?.image?.[0]) {
      imageFilename = req.files.image[0].filename;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        categoryId,
        price,
        description,
        discountPrice,
        title,
        productQuantity,
        status,
        imageUrl: imageFilename
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product updated successfully',
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
}

const addToCart = async (req, res) => {
  try {
    const { productId, productname, price, quantity } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const cartItem = await cartModel.create({
      productId,
      productname,
      price,
      userId,
      quantity
    });

    return res.status(201).json({
      message: 'Product added to cart successfully',
      success: true,
      data: cartItem
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

const cartList = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const cartItems = await cartModel.find({ userId }).populate('productId');
    return res.status(200).json({
      message: 'Cart items retrieved successfully',
      success: true,
      data: cartItems
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

const rmoveFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    const cartItem = await cartModel.findOneAndDelete({ _id: cartItemId, userId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found', success: false });
    }
    return res.status(200).json({
      message: 'Cart item removed successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}
module.exports = { add, get, edit, update, addToCart, cartList, rmoveFromCart };