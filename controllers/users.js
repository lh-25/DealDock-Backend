const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        // Check if the username is already taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.json({error: 'Username already taken.'});
        }
        // Create a new user with hashed password
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/signin', async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
          const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET);
          res.status(200).json({ token });
      } else {
          res.status(401).json({ error: 'Invalid username or password.' });
      }
  } catch (error) {
      res.status(400).json({ error: error.message });
  }})

router.post('/:userId/reviews', async (req, res) => {
    try {
      req.body.author = req.user._id
      const user = await User.findById(req.params.userId)
      console.log(user)
      user.reviews.push(req.body)
      await user.save()
      // Find the newly created review 
      const newReview = user.reviews[user.reviews.length - 1]
      newReview._doc.author = req.user
  
      //Respond with the newReview
      res.status(201).json(newReview)
  
    } catch (error) {
      res.status(500).json(error)
    }
  })
  
  // PUT /products/:productId/comments/:commentId
  router.put('/:userId/reviews/:reviewId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
      const review = user.reviews.id(req.params.reviewId)
      review.text = req.body.text
      await user.save()
      res.status(200).json({ message: 'OK' })
    } catch (error) {
      res.status(500).json(error)
    }
  })
  
  //DELETE /products/:productId/comments/:commentId
  router.delete('/:userId/reviews/:reviewId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
      user.reviews.remove({ _id: req.params.reviewId })
      await user.save()
      res.status(200).json({ message: 'Ok' })
    } catch (error) {
      res.status(500).json(error)
    }
  })
  






module.exports = router;