require('dotenv').config();
const uploadFilesMiddleware = require('../middlewares/uploadFile');
const User = require('../models/User');

const baseUrl = process.env.HOST_URL + '/api/user/image/';

const uploadUserImage = async (req, res) => {
  const { id } = req.params;
  try {
    await uploadFilesMiddleware(req, res);

    if (req.file == undefined) {
      return res.send({
        message: 'You must select a file.',
      });
    }

    await User.findByIdAndUpdate(id, {
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
