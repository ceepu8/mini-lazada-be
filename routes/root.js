const express = require('express');

const rootRouter = express.Router();

const userRouter = require('./user');
const productRouter = require('./product');
const authRouter = require('./auth');

rootRouter.use('/user', userRouter);
rootRouter.use('/product', productRouter);
rootRouter.use('/auth', authRouter);

module.exports = rootRouter;
