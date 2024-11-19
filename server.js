const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');


const profilesRouter = require('./controllers/profiles');
const productsRouter = require('./controllers/products');
const usersRouter = require('./controllers/users');
const authRoutes = require('./controllers/auth');


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
app.use('/auth', authRoutes); 
console.log(authRoutes)


app.listen(3002, () => {
  console.log('The express app is ready!');
});
