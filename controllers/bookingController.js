const bookingModel = require('../models/bookingModel');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const add = async (req, res) => {
  try {

    const { cartId, partnerId, date, slotId } = req.body;

    const userId = req.user.userId;

    const booking = await bookingModel.create({
      cartId,
      userId,
      partnerId,
      date,
      slotId
    });

    return res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {
    return res.status(404).json({
      errors: [error.message]
    });
  }
};

const getUserBookings = async (req, res) => {
  try {

    const userId = req.user.userId; // from JWT middleware

    const bookings = await bookingModel
      .find({ userId })
      .populate("slotId", "time")
      .populate("partnerId", "name contactNo")
      .populate("cartId")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}


const getPartnerBookings = async (req, res) => {
  try {

    const partnerId = req.user.userId;

    const bookings = await bookingModel
      .find({ partnerId })
      .populate("slotId", "time")
      .populate("userId", "name contactNo address")
      .populate("cartId")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {

    const { bookingId, status } = req.body;
    const partnerId = req.user.userId;

    const booking = await bookingModel.findOneAndUpdate(
      { _id: bookingId, partnerId: partnerId },
      { status: status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or not assigned to this partner"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
};
module.exports = { add, getUserBookings, getPartnerBookings, updateBookingStatus };