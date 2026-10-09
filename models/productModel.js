const mongoose =require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true },
    discountPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    status: { type: String, required: true, enum: ["available", "unavailable"], default: "available"},
});

const product = mongoose.model('product', productSchema);

module.exports = product;