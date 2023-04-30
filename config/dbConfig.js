require('dotenv').config();

module.exports = {
  url: process.env.DATABASE_URL,
  database: 'Cluster0',
  imgBucket: 'images',
};
