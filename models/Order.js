const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  products: [
    {
      productID: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'hubs',
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'delivered', 'canceled'],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('orders', OrderSchema);
