const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controller/auth');
const { authenticateWithTokenOnly } = require('../middlewares/verifyToken');
const authRouter = express.Router();

authRouter.get('/profile', authenticateWithTokenOnly, getProfile);
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);

module.exports = authRouter;
