const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  replies: [
    {
      text: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
})


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imgURL: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
    comments: [commentSchema]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
