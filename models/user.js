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
  },
  roles: {
    buyer: { type: Boolean, default: false }, 
    seller: { type: Boolean, default: false } 
  },
  reviews: [
    {
      rating: { type: Number, required: true, min: 1, max: 5 }, 
      title: { type: String, required: true }, 
      body: { type: String, required: true }, 
      createdAt: { type: Date, default: Date.now }, 
      updatedAt: { type: Date, default: Date.now }
    }
  ] 
})


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword
  }
})


const User = mongoose.model('User', userSchema);

module.exports = { User }
