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
