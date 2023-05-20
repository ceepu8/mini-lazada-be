//  RMIT University Vietnam
//  Course: COSC2430 Web Programming
//  Semester: 2023A
//  Assessment: Assignment 2
//  Authors + StudentIDs:
// Cao Ngoc Phuong Uyen - s3919659
// Hua Van Anh Khoa - s3883254
// Nguyen Duy Khang - s3963613
// Huynh Bao Khang – s3911723
// Hoang Minh Khoi – s3854233
//  Acknowledgement: In the document

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
