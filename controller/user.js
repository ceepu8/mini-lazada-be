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

require('dotenv').config();
const uploadFilesMiddleware = require('../middlewares/uploadFile');
const User = require('../models/User');

const baseUrl = process.env.HOST_URL + '/api/user/image/';

const uploadUserImage = async (req, res) => {
  const {
    data: { userId },
  } = req.tokenDecode;
  try {
    await uploadFilesMiddleware(req, res);

    if (req.file == undefined) {
      return res.send({
        message: 'You must select a file.',
      });
    }

    await User.findByIdAndUpdate(userId, {
      profileImage: baseUrl + req.file.filename,
    });

    return res.send({
      message: 'Profile image file has been uploaded.',
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

module.exports = { uploadUserImage };
