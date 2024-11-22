const express = require('express')
const verifyToken = require('../middleware/verify-token')
const Product = require('../models/product')
const { default: mongoose } = require('mongoose')
const router = express.Router()


router.use(verifyToken)

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


router.get('/my-products', async (req, res) => {
  try {

    const products = await Product.find({ seller: req.user._id })
      .populate('seller')
      .sort({ createdAt: 'desc' })
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(['seller', 'comments.author'])
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.put('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)

    if (!product.seller.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!")
    }

    const updatedproduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })


    updatedproduct._doc.seller = req.user


    res.status(200).json(updatedproduct)
  } catch (error) {
    res.status(500).json(error)
  }
})



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


router.patch('/:productId/bid', async (req, res) => {
  try {
    const { bid } = req.body;
    const product = await Product.findById(req.params.productId).populate(['seller', 'comments.author'])

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    if (bid <= product.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than the current bid' });
    }


    product.currentBid = bid;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/:productId/comments', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    req.body.author = req.user._id;
    product.comments.push(req.body);
    await product.save();

    const newComment = product.comments[product.comments.length - 1];
    newComment._doc.author = req.user;

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});



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