require('dotenv').config();
require('module-alias/register');

const express = require('express');
const mongoose = require('mongoose');
const rootRouter = require('@routes/root');

const mongoString = process.env.DATABASE_URL;
const PORT = 3001;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});
const app = express();

app.use(express.json());
app.use('/api', rootRouter);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
