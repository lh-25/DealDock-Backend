const mongoose = require('mongoose')
const Schema = mongoose.Schema


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imgURL: {type: String, required: true},
    seller: { type: mongoose.Schema.Types.ObjectId, required: true }
    
},
{ timestamps: true }
)

module.exports = mongoose.model('product', productSchema)