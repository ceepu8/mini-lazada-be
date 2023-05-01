require('dotenv').config();
const mongoose = require('mongoose');

const uploadFilesMiddleware = require('../middlewares/uploadFile');
const Product = require('../models/Product');

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
  const { min = 0, max = 0 } = req.query || {};

  let priceCondition = {};
  if (min && max && min >= 0 && max >= 0) {
    priceCondition = {
      price: { $gt: min, $lt: max },
    };
  }

  try {
    let products = await Product.find({ ...priceCondition }).populate('vendor');
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
    if (products.length > 0) {
      res.status(200).json({ success: true, message: 'Success', products });
    } else {
      res.status(404).json({ success: true, message: 'There is not any products' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getProductPrice = async (req, res) => {};

module.exports = { createProduct, getProductById, getAllProducts, getProductPrice };
