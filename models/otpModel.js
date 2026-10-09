const mongoose =require('mongoose');
const otpSchema = new mongoose.Schema({
    contactNo: { type: Number, required: true },
    otp: { type: Number, required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, expires: 900 }
});

 const otps = mongoose.model('otps', otpSchema);

module.exports = otps;