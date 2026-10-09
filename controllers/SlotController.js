const slotModel = require('../models/SlotModel');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const slotDateModel = require('../models/SlotDateModel');

const add = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const { time } = req.body;

    const slot = await slotModel.create({
      time
    });

    return res.status(201).json({
      message: 'Slot created successfully',
      success: true,
      data: slot
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

const get = async (req, res) => {
  try {
    const slots = await slotModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Slots retrieved successfully',
      success: true,
      data: slots
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

const edit = async (req, res) => {
  try {
    const { id } = req.body;
    const slot = await slotModel.findOne({ _id: id });
    if (!slot) {
      return res.status(404).json({
        errors: ['Slot not found']
      });
    }
    return res.status(200).json({
      message: 'Slot retrieved successfully',
      success: true,
      data: slot
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }

}

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }
  try {
    const { id, time } = req.body;
    const slot = await slotModel.findOne({ _id: id });
    if (!slot) {
      return res.status(404).json({
        errors: ['Slot not found']
      });
    }
    slot.time = time;
    await slot.save();
    return res.status(200).json({ 
      message: 'Slot updated successfully',
      success: true,
      data: slot 
    });
  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
} 

const partnerSlot = async (req, res) => {

  try {
    const {slot_ids} = req.body;
    const userId = req.user.userId;
    
    const user = await userModel.findOne({
        _id: userId,
        role: "partner"
      });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }
    user.slot_id = slot_ids;
    await user.save();
    return res.status(200).json({
      message: 'Slots assigned to partner successfully',
      success: true,
      data: user
    });
   
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
} 

const addDate = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => err.msg)
    });
  }

  try {
    const { date, slotIds } = req.body;

    const slot = await slotDateModel.create({
      date,
      slotIds
    });

    return res.status(201).json({
      message: 'Slot date created successfully',
      success: true,
      data: slot
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
}

const getSlotDates = async (req, res) => {
  try {

    const slotDates = await slotDateModel
      .find()
      .populate("slotIds", "time")
      .sort({ date: 1 });

    return res.status(200).json({
      message: "Slot date list fetched successfully",
      success: true,
      data: slotDates
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
};

const editDate = async (req, res) => {
  try {

    const { id } = req.params;

    const slotDate = await slotDateModel
      .findById(id)
      .populate("slotIds", "time");

    if (!slotDate) {
      return res.status(404).json({
        success: false,
        message: "Slot date not found"
      });
    }

    return res.status(200).json({
      message: "Slot date fetched successfully",
      success: true,
      data: slotDate
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
};

const updateDate = async (req, res) => {
  try {

    const { id } = req.params;
    const { date, slotIds } = req.body;

    const updatedData = await slotDateModel.findByIdAndUpdate(
      id,
      {
        date,
        slotIds
      },
      { new: true }
    ).populate("slotIds", "time");

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "Slot date not found"
      });
    }

    return res.status(200).json({
      message: "Slot date updated successfully",
      success: true,
      data: updatedData
    });

  } catch (error) {
    return res.status(500).json({
      errors: [error.message]
    });
  }
};

module.exports = { add, get, edit, update,partnerSlot, addDate, getSlotDates, editDate, updateDate };