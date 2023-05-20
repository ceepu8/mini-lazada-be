//  RMIT University Vietnam
//  Course: COSC2430 Web Programming
//  Semester: 2023A
//  Assessment: Assignment 2
//  Authors + StudentIDs:
// Cao Ngoc Phuong Uyen - s3919659
// Hua Van Anh Khoa - s3883254
// Nguyen Duy Khang - s3963613
// Huynh Bao Khang – s3911723
// Hoang Minh Khoi – s3854233
//  Acknowledgement: In the document

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
