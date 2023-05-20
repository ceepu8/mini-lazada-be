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

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
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
