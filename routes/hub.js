const express = require('express');
const hubRouter = express.Router();

const { createHub, getHub } = require('../controller/hub');

hubRouter.get('/', getHub);
hubRouter.post('/', createHub);

module.exports = hubRouter;
