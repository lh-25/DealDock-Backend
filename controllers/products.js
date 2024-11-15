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
    const product = await Product.findById(req.params.productId).populate('seller')
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


module.exports = router