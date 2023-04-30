const dbConfig = require('../config/dbConfig');

const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const Product = require('../models/Product');

const mongoURI = dbConfig.url;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
conn.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: dbConfig.imgBucket,
  });
});

const uploadFilesMiddleware = require('../middlewares/uploadFile');

const mongoClient = new MongoClient(mongoURI);

const baseUrl = 'http://localhost:3001/api/product/image';

const uploadProductImage = async (req, res) => {
  const { id } = req.params;
  try {
    await uploadFilesMiddleware(req, res);

    if (req.file == undefined) {
      return res.send({
        message: 'You must select a file.',
      });
    }

    await Product.findByIdAndUpdate(id, {
      image: baseUrl + req.file.filename,
    });

    return res.send({
      message: 'Product image file has been uploaded.',
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: `Error when trying upload image: ${error}`,
    });
  }
};

const getProductImage = async (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, file) => {
    //Check if file

    if (!file || file.length == 0) {
      return res.status(404).json({ success: false, message: 'No files exist' });
    }

    //Check if image
    if (file[0].contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({ success: false, message: 'Not an image' });
    }
  });
};

module.exports = { getProductImage, uploadProductImage };
