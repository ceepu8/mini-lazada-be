const express = require('express');
const { uploadProductImage, getImage } = require('../controller/upload');
const {
  createProduct,
  getProductById,
  getAllProducts,
  getMyProducts,
} = require('../controller/product');
const { authorize, verifyToken } = require('../middlewares/verifyToken');
const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/get-my-products', verifyToken, getMyProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', authorize(['vendor']), verifyToken, createProduct);
productRouter.put('/:id');
productRouter.delete('/:id');
productRouter.post('/upload-image/:id', uploadProductImage);
productRouter.get('/image/:filename', getImage);

module.exports = productRouter;
