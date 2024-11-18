const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Product = require('../models/product')
const router = express.Router()

// ========== Public Routes ===========

// ========= Protected Routes =========
router.use(verifyToken)
// POST /products
router.post('/', async (req, res) => {
  try {
    req.body.seller = req.user._id
    const product = await Product.create(req.body)
    product._doc.seller = req.user
    res.status(201).json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})
// GET /products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('seller')
      .sort({ createdAt: 'desc' });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /products/:productId

router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('seller','comments.author')
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
})

// PUT /products/:productId

router.put('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    // Check permissons
    if (!product.seller.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }
    // Update product
    const updatedproduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })

    // Append req.user to the seller property
    updatedproduct._doc.seller = req.user

    // Issue JSON response
    res.status(200).json(updatedproduct)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE /products/:productId

router.delete('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product.seller.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }
    const deletedproduct = await Product.findByIdAndDelete(req.params.productId)
    res.status(200).json(deletedproduct)
  } catch (error) {
    res.status(500).json(error)
  }
})


// POST /products/:productId/comments

router.post('/:productId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id
    const product = await Product.findById(req.params.productId)
    console.log(product)
    product.comments.push(req.body)
    await product.save()
    // Find the newly created comment 
    const newComment = product.comments[product.comments.length - 1]
    newComment._doc.author = req.user

    //Respond with the newComment
    res.status(201).json(newComment)

  } catch (error) {
    res.status(500).json(error)
  }
})

// PUT /products/:productId/comments/:commentId
router.put('/:productId/comments/:commentId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    const comment = product.comments.id(req.params.commentId)
    comment.text = req.body.text
    await product.save()
    res.status(200).json({ message: 'OK' })
  } catch (error) {
    res.status(500).json(error)
  }
})

//DELETE /products/:productId/comments/:commentId
router.delete('/:productId/comments/:commentId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    product.comments.remove({ _id: req.params.commentId })
    await product.save()
    res.status(200).json({ message: 'Ok' })
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router