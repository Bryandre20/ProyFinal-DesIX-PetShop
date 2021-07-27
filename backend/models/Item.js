const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        createIndexes: { unique: true },
        unique: true
    },
    name: String,
    category: String,
    image: String,
    description: String, 
    price: { type: Number, default: 0.00 },
    brand: String,
    rating: { type: Number, default: 0.0 },
    numReviews: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
});

const ItemModel = mongoose.model('Item', ItemSchema);

module.exports = {
    ItemModel
}