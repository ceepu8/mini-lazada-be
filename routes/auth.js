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
const { registerUser, loginUser, getProfile } = require('../controller/auth');
const { authenticateWithTokenOnly } = require('../middlewares/verifyToken');
const authRouter = express.Router();

authRouter.get('/profile', authenticateWithTokenOnly, getProfile);
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);

module.exports = authRouter;
