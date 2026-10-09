const { checkSchema } = require('express-validator');

const slotSchema = checkSchema({
  time: {
    notEmpty: {
      errorMessage: 'Time is required'
    },
    trim: true,
    unique: true
  }
});

module.exports = slotSchema;
