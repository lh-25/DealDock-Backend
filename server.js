const dotenv = require ('dotenv');
dotenv.config(); 
const cors = require ('cors')
const express = require ('express')
const app = express () ;
const mongoose = require ('mongoose');

const profilesRouter = require('./controllers/profiles')
const reviewsRouter = require ('./controllers/reviews')
const productsRouter = require ('./controllers/products')
const usersRouter = require ('./controllers/users')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log (`Connected to MongoDB ${mongoose.connection.name} `)
});

app.use (cors());
app.use(express.json());

app.use ('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/reviews', reviewsRouter)
app.use('/products', productsRouter)

app.listen (3002, () => {
    console.log('The express app is ready!');
});
