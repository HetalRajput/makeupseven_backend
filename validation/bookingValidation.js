const { checkSchema } = require("express-validator");

const bookingSchema = checkSchema({
  cartId: {
    notEmpty: {
      errorMessage: "Cart Id is required"
    }
  },

  partnerId: {
    notEmpty: {
      errorMessage: "Partner Id is required"
    }
  },

  slotId: {
    notEmpty: {
      errorMessage: "Slot Id is required"
    }
  },

  date: {
    notEmpty: {
      errorMessage: "Date is required"
    }
  }
});

module.exports = bookingSchema;