const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('slot', slotSchema);
