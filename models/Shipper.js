const mongoose = require('mongoose');
const UserSchema = require('./User');

const { Schema } = mongoose;

const ShipperSchema = new Schema({
  hub: {
    type: Schema.Types.ObjectId,
    ref: 'hubs',
  },
});

const Shipper = UserSchema.discriminator('shipper', ShipperSchema);

module.exports = { Shipper };
