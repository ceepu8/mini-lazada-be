const express = require('express');

const rootRouter = express.Router();

const userRouter = require('./user');
const productRouter = require('./product');
const authRouter = require('./auth');
const hubRouter = require('./hub');

rootRouter.use('/user', userRouter);
rootRouter.use('/product', productRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/hub', hubRouter);

module.exports = rootRouter;
