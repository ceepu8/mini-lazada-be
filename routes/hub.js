const express = require('express');
const hubRouter = express.Router();

const { createHub } = require('../controller/hub');

hubRouter.post('/', createHub);

module.exports = hubRouter;
