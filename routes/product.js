const express = require('express');
const productRouter = express.Router();

productRouter.get('/');
productRouter.get('/:id');
productRouter.post('/');
productRouter.put('/:id');
productRouter.delete('/:id');

module.exports = productRouter;
