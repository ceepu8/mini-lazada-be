const express = require('express');
const { createOrder } = require('../controller/order');
const { verifyToken, authorize } = require('../middlewares/verifyToken');
const orderRouter = express.Router();

orderRouter.post('/', authorize(['customer']), verifyToken, createOrder);
orderRouter.get('/:id');
orderRouter.get('/');

module.exports = orderRouter;
