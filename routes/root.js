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
