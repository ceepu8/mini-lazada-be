const express = require('express');
const { uploadProductImage, getProductImage } = require('../controller/upload');
const { createProduct } = require('../controller/product');
const { authorize } = require('../middlewares/verifyToken');
const productRouter = express.Router();

productRouter.get('/');
productRouter.get('/:id');
productRouter.post('/', authorize(['vendor']), createProduct);
productRouter.put('/:id');
productRouter.delete('/:id');
productRouter.post('/upload-image/:id', uploadProductImage);
productRouter.get('/image/:filename', getProductImage);

module.exports = productRouter;
