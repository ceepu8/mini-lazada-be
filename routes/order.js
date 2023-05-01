const express = require('express');
const { createOrder, getOrderById, getOrder } = require('../controller/order');
const { verifyToken, authorize } = require('../middlewares/verifyToken');
const orderRouter = express.Router();

orderRouter.post('/', authorize(['customer']), verifyToken, createOrder);
orderRouter.get('/:id', verifyToken, getOrderById);
orderRouter.get('/', verifyToken, getOrder);

module.exports = orderRouter;
