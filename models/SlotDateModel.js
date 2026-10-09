const mongoose = require('mongoose');

const slotDateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    slotIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "slot"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('slotDate', slotDateSchema);