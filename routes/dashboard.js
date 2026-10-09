const express = require('express');
const routes = express.Router();
const homeController = require('../controllers/homeController.js');
const authtoken =  require('../middleware/authtoken.js'); // Import auth token middleware

routes.get('/', authtoken,homeController.dashboard);

module.exports = routes;