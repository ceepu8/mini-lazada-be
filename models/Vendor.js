const mongoose = require('mongoose');
const UserSchema = require('./User');

const { Schema } = mongoose;

const VendorSchema = new Schema({
  businessName: {
    type: String,
  },
  businessAddress: {
    type: String,
  },
});

const Vendor = UserSchema.discriminator('vendor', VendorSchema);

module.exports = { Vendor };
