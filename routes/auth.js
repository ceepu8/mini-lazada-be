const express = require('express');
const { registerUser, loginUser } = require('../controller/auth');
const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);

module.exports = authRouter;
