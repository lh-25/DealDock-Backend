const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');


const profilesRouter = require('./controllers/profiles');
const productsRouter = require('./controllers/products');
const usersRouter = require('./controllers/users');


const PORT = process.env.PORT ? process.env.PORT : 3002


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });

app.use(cors());
app.use(express.json());


app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/products', productsRouter);


app.listen(PORT, () => {
  console.log('The express app is ready!');
});
