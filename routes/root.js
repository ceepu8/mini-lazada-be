const express = require('express');

const rootRouter = express.Router();

const userRouter = require('./user');
const productRouter = require('./product');

rootRouter.use('/user', userRouter);
rootRouter.use('/product', productRouter);

module.exports = rootRouter;
