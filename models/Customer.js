const mongoose = require('mongoose');
const UserSchema = require('./User');

const { Schema } = mongoose;

const CustomerSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
});

const Customer = UserSchema.discriminator('customer', CustomerSchema);

module.exports = { Customer };
