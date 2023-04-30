const express = require('express');
const { uploadUserImage } = require('../controller/user');
const { getImage } = require('../controller/upload');
const userRouter = express.Router();

userRouter.get('/');
userRouter.get('/:id');
userRouter.put('/:id');
userRouter.post('/upload-image/:id', uploadUserImage);
userRouter.get('/image/:filename', getImage);
userRouter.delete('/:id');

module.exports = userRouter;
