const express = require('express');

const userRouter = express.Router();

userRouter.get('/', async (res) => {
  console.log('user router');
  res.status(200);
});

module.exports = userRouter;
