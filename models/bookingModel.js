const mongoose =require('mongoose');

const bookingSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'cart', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: Date, required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'slot', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
});

const booking = mongoose.model('bookings', bookingSchema);

module.exports = booking;