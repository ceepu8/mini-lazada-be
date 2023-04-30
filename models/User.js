const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'vendor', 'shipper'],
  },
  profileImage: {
    type: String,
  },
});

module.exports = mongoose.model('users', UserSchema);
