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
const { createOrder, getOrderById, getOrder, updateOrderStatus } = require('../controller/order');
const { verifyToken, authorize } = require('../middlewares/verifyToken');
const orderRouter = express.Router();

orderRouter.post('/', authorize(['customer']), verifyToken, createOrder);
orderRouter.get('/:id', verifyToken, getOrderById);
orderRouter.get('/', verifyToken, getOrder);
orderRouter.put('/:id', authorize(['shipper']), verifyToken, updateOrderStatus);

module.exports = orderRouter;
