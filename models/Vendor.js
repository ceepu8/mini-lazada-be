const mongoose = require('mongoose');

const { Schema } = mongoose;

const VendorSchema = new Schema({
  businessName: {
    type: String,
  },
  businessAddress: {
    type: String,
  },
});

module.exports = mongoose.model('users', VendorSchema);
