const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now()
        }
    }
)

const ProductModel = mongoose.model('products', ProductSchema)

module.exports = ProductModel