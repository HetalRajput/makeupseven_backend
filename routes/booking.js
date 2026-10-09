const express = require('express');
const routes = express.Router();
const bookingController = require('../controllers/bookingController.js');
const bookingValidation = require('../validation/bookingValidation.js');
const authtoken = require('../middleware/authtoken.js');

routes.post('/add', authtoken, bookingValidation, bookingController.add);
routes.get('/getUserBookings', authtoken, bookingController.getUserBookings);
routes.get('/getPartnerBookings', authtoken, bookingController.getPartnerBookings);
routes.put('/updateStatus', authtoken, bookingController.updateBookingStatus);
module.exports = routes;
