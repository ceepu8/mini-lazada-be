const express = require('express');
const { registerUser } = require('../controller/auth');
const authRouter = express.Router();

authRouter.post('/login');
authRouter.post('/register', registerUser);

module.exports = authRouter;
