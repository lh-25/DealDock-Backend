const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword; 
  }
});

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 }, 
    title: { type: String, required: true }, 
    body: { type: String, required: true }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  },
  { timestamps: true } 
);

const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { User, Review };
