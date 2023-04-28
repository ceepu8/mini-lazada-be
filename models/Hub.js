const mongoose = require('mongoose');

const { Schema } = mongoose;

const HubSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
  },
});

module.exports = mongoose.model('hubs', HubSchema);
