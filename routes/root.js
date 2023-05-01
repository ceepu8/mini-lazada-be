const express = require('express');

const rootRouter = express.Router();

const userRouter = require('./user');
const productRouter = require('./product');
const authRouter = require('./auth');
const hubRouter = require('./hub');
const orderRouter = require('./order');

rootRouter.use('/user', userRouter);
rootRouter.use('/product', productRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/hub', hubRouter);
rootRouter.use('/order', orderRouter);

module.exports = rootRouter;
