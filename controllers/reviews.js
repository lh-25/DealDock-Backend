const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Review = require('../models/review')
const router = express.Router()

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)
// POST /reviews
router.post('/', async (req, res) => {
  try {
    req.body.author = req.user._id
    console.log(req.user.id)
    const review = await Review.create(req.body)
    review._doc.author = req.user
    res.status(201).json(review)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})
// GET /reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('author')
      .sort({ createdAt: 'desc' });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /reviews/:reviewId

router.get('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate('author')
    res.status(200).json(review)
  } catch (error) {
    res.status(500).json(error)
  }
})

// PUT /reviews/:reviewId

router.put('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
    // Check permissons
    if (!review.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, { new: true })

    // Append req.user to the author property
    updatedReview._doc.author = req.user

    // Issue JSON response
    res.status(200).json(updatedReview)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE /reviews/:reviewId

router.delete('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
    if (!review.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId)
    res.status(200).json(deletedReview)
  } catch (error) {
    res.status(500).json(error)
  }
})

// POST /reviews/:reviewId/comments

router.post('/:reviewId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id
    const review = await Review.findById(req.params.reviewId)
    console.log(review)
    review.comments.push(req.body)
    await review.save()
    // Find the newly created comment 
    const newComment = review.comments[review.comments.length - 1]
    newComment._doc.author = req.user

    //Respond with the newComment
    res.status(201).json(newComment)

  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router