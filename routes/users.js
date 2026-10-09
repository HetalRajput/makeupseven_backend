const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userController.js');
const {registrationSchema} = require('../validation/userValidation.js');
const upload = require('../middleware/userMulterConfig.js');
const partnerController = require('../controllers/partnerController.js');
const { partnerValidation } = require('../validation/partnerValidation.js');
const homeController = require('../controllers/homeController.js');

// const userDetailController = require('../controllers/userDetailController.js');
const authtoken =  require('../middleware/authtoken.js'); // Import auth token middleware

routes.post('/login', userController.login);
routes.get('/dashboard', authtoken,homeController.dashboard);
routes.post('/register',registrationSchema, userController.registration);
routes.post('/verifyOtp', userController.verifyOtp);
routes.post('/appLogin', userController.appLogin);

// routes.post('/userDetailSave', userDetailController.userDetailAdd);
routes.post('/edit', authtoken,userController.editUser);
routes.post('/update',authtoken,userController.updateUser);
routes.post('/', authtoken,userController.getUsers);
routes.post('/partnerRegister',upload,partnerValidation, partnerController.register);
routes.post('/getPartner', authtoken,partnerController.getVendor);
routes.post('/editPartner', authtoken,partnerController.editVendor);
routes.post('/updatePartner', authtoken,upload,partnerController.updateVendor);
routes.put('/updatePartnerStatus', authtoken,partnerController.updatePartnerStatus);
routes.get('/getPartnerSlot', authtoken,partnerController.getSlot);

module.exports = routes;