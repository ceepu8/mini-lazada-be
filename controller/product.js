require('dotenv').config();
const mongoose = require('mongoose');

const uploadFilesMiddleware = require('../middlewares/uploadFile');
const Product = require('../models/Product');
const User = require('../models/User');

const baseUrl = process.env.HOST_URL + '/api/product/image/';

const createProduct = async (req, res) => {
  try {
    await uploadFilesMiddleware(req, res);
    const { name, price, description } = req.body;
    const {
      data: { userId },
    } = req.tokenDecode;

    if (req.file == undefined) {
      return res.send({
        message: 'You must select a file.',
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image: baseUrl + req.file.filename,
      vendor: userId,
    });
    await newProduct.save();

    const product = await newProduct.populate('vendor');

    res.status(200).json({
      success: true,
      message: 'Product created successfully!',
      product: {
        id: product._id,
        name,
        price,
        description,
        image: baseUrl + req.file.filename,
        vendor: {
          businessName: product.vendor.businessName,
          businessAddress: product.vendor.businessAddress,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const productFound = await Product.findById(id).populate('vendor');
    console.log(productFound);
    if (!productFound) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Success',
      product: {
        id: productFound._id,
        name: productFound.name,
        price: productFound.price,
        description: productFound.description,
        image: productFound.image,
        vendor: {
          businessName: productFound?.vendor.businessName || {},
          businessAddress: productFound?.vendor.businessAddress || {},
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAllProducts = async (req, res) => {
  const { min, max, page = 1, limit = 10 } = req.query || {};

  let priceCondition = {};
  if (min && max && min >= 0 && max >= 0) {
    priceCondition = {
      price: { $gt: min, $lt: max },
    };
  }

  try {
    const count = await Product.countDocuments({ ...priceCondition });
    const totalPages = Math.ceil(count / limit);

    const products = await Product.find({ ...priceCondition })
      .populate('vendor')
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedProducts = products.map((prod) => ({
      id: prod._id,
      name: prod.name,
      price: prod.price,
      description: prod.description,
      image: prod.image,
      vendor: {
        businessName: prod.vendor.businessName,
        businessAddress: prod.vendor.businessAddress,
      },
    }));

    if (formattedProducts.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Success',
        totalPages,
        currentPage: parseInt(page),
        products: formattedProducts,
      });
    } else {
      res.status(200).json({ success: true, message: 'There are no products', products: [] });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMyProducts = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;

  try {
    let vendor = await User.findById(userId).select('-password');

    if (vendor.role === 'vendor') {
      let products = await Product.find({ vendor: vendor._id }).populate('vendor');
      products = products.map((prod) => ({
        id: prod._id,
        name: prod.name,
        price: prod.price,
        description: prod.description,
        image: prod.image,
        vendor: {
          businessName: prod.vendor.businessName,
          businessAddress: prod.vendor.businessAddress,
        },
      }));
      return res.status(200).json({ success: true, message: 'Success', products });
    } else {
      return res.status(404).json({ success: true, message: 'You are unauthorized' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProductPrice = async (req, res) => {};

module.exports = { createProduct, getProductById, getAllProducts, getProductPrice, getMyProducts };
