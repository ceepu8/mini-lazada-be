const mongoose = require('mongoose');

const { Schema } = mongoose;

const ShipperSchema = new Schema({
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'hubs',
  },
});

module.exports = mongoose.model('shippers', ShipperSchema);
