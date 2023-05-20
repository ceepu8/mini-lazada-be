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

const dbConfig = require('../config/dbConfig');

const Product = require('../models/Product');
const MongoClient = require('mongodb').MongoClient;
const GridFSBucket = require('mongodb').GridFSBucket;

const mongoURI = dbConfig.url;
const mongoClient = new MongoClient(mongoURI);

const uploadFilesMiddleware = require('../middlewares/uploadFile');

const baseUrl = 'http://localhost:3001/api/product/image/';

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

const getImage = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.on('data', function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on('error', function (err) {
      return res.status(404).send({ message: 'Cannot download the Image!' });
    });

    downloadStream.on('end', () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { getImage, uploadProductImage };
