const Review = require('../models/review')
const express = require('express')
const router = express.Router()


// CREATE - POST - /reviews
router.post('/', async (req,res) => {
  try {
    const addReview = await Review.create(req.body)
    res.status(201).json(addReview)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})


// READ - GET - /reviews
router.get('/', async (req, res) => {
  try {
    const getAllReviews = await Review.find()
    res.status(201).json(getAllReviews)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

// READ - GET - /reviews/:reviewId
router.get('/:reviewId', async (req,res) => {
  try {
    const getReview = await Review.findById(req.params.reviewId)
    if (!getReview) {
      res.status(404)
      throw new Error("review not Found.");
    }
    res.status(200).json(getReview)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({error: error.message})
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})



// UPDATE - PUT - /reviews/:reviewId
router.put('/:reviewId', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {new: true})
    if (!updatedReview) {
      res.status(404)
      throw new Error("review not found");
    } 
    res.status(200).json(updatedReview)
  } catch (error) {
    if (res.status === 404) {
      res.json({error: error.message})
    } else {
      res.status(500).json({error: error.message})
    }
  }
})


// DELETE - DELETE - /reviews/:reviewId
router.delete('/:reviewId', async (req, res) => {
  try {
    const deleteReview = await Review.findByIdAndDelete(req.params.reviewId)
    if (!deleteReview) {
      res.status(404).json({error: error.message})
      throw new Error("review not found");
      
    }
    res.status(200).json(deleteReview)
  } catch (error) {
    if (res.statusCode === 404) {
      res.json({error: error.message})
    } else {
      res.status(500).json({error: error.message})
    }
  }
})



module.exports = router