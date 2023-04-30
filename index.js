require('dotenv').config();
require('module-alias/register');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');

const rootRouter = require('@routes/root');

const mongoString = process.env.DATABASE_URL;
const PORT = 3001;

mongoose
  .connect(mongoString)
  .then(() => console.warn('MongoDB connected successfully!'))
  .catch((err) => {
    throw 'error occurred ' + err;
  });
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', rootRouter);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
