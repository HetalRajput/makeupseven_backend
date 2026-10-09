const mongoose =require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    productname: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;