const express = require('express');
const routes = express.Router();
const slotController = require('../controllers/SlotController.js');
const slotValidation = require('../validation/slotValidation.js');
const authtoken = require('../middleware/authtoken.js');

routes.post('/add', authtoken, slotValidation, slotController.add);
routes.get('/', authtoken, slotController.get);
routes.post('/edit', authtoken, slotController.edit);
routes.post('/update', authtoken, slotValidation, slotController.update);
routes.put('/partner-slot',authtoken,slotController.partnerSlot);

routes.post('/add-date', authtoken, slotController.addDate);
routes.get('/dates', authtoken, slotController.getSlotDates);
routes.get('/edit-date/:id', authtoken, slotController.editDate);
routes.post('/update-date/:id', authtoken, slotController.updateDate);
module.exports = routes;
