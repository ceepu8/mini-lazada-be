const Product = require('../models/Product');

const createProduct = async (req, res) => {
  const { name, price, description, vendor } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image: '',
      vendor,
    });
    await newProduct.save();

    const product = await newProduct.populate('vendor');
    res.status(200).json({
      success: true,
      message: 'Product created successfully!',
      user: {
        name,
        price,
        description,
        image: '',
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
