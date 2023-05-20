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
const { uploadUserImage } = require('../controller/user');
const { getImage } = require('../controller/upload');
const { authenticate, authenticateWithTokenOnly } = require('../middlewares/verifyToken');
const userRouter = express.Router();

userRouter.get('/:id');
userRouter.put('/:id');
userRouter.post('/upload-image', authenticateWithTokenOnly, uploadUserImage);
userRouter.get('/image/:filename', getImage);
userRouter.delete('/:id');

module.exports = userRouter;
