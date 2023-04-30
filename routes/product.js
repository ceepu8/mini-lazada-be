const express = require('express');
const multer = require('multer');
const { uploadProductImage, getImage } = require('../controller/upload');
const { createProduct } = require('../controller/product');
const { authorize } = require('../middlewares/verifyToken');
const productRouter = express.Router();

const middle = express.urlencoded({
  extended: false,
  limit: 10000,
  parameterLimit: 2,
});

productRouter.get('/');
productRouter.get('/:id');
productRouter.post('/', authorize(['vendor']), createProduct);
productRouter.put('/:id');
productRouter.delete('/:id');
productRouter.post('/upload-image/:id', uploadProductImage);
productRouter.get('/image/:filename', getImage);

module.exports = productRouter;
