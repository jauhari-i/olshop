const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    deskription: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
    },
    category: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        default: 'default-product.png'
    }
})

const Product = mongoose.model('Product',ProductSchema) 
module.exports = Product