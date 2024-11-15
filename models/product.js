const moongoose = require('mongoose')
const Schema = mongoose.Schema


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    imgURL: {type: String, required: true},
    sellerUsername: {type: String, required: true}
    
},
{ timestamps: true }
)

module.exports.productSchema = productSchema