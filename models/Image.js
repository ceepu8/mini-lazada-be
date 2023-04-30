const mongoose = require('mongoose');

const { Schema } = mongoose;

var ImageSchema = Schema({
  image: { data: Buffer, contentType: String },
});

module.exports = mongoose.model('images', ImageSchema);
