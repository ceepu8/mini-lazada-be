require('dotenv').config();
const uploadFilesMiddleware = require('../middlewares/uploadFile');
const Product = require('../models/Product');

const baseUrl = process.env.HOST_URL + '/api/product/image/';

const createProduct = async (req, res) => {
  try {
    await uploadFilesMiddleware(req, res);
    const { name, price, description, vendor } = req.body;

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
      vendor,
    });
    await newProduct.save();

    const product = await newProduct.populate('vendor');
    res.status(200).json({
      success: true,
      message: 'Product created successfully!',
      product: {
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

module.exports = { createProduct };
