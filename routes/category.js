// routes/categoryRoutes.js
const express = require('express');
const routes = express.Router();
const categoryController = require('../controllers/categoryController.js');
const { categoryValidation } = require('../validation/categoryValidation.js');
const upload = require('../middleware/multerConfig.js');
const authtoken = require('../middleware/authtoken.js');

routes.post('/add', authtoken, upload, categoryValidation, categoryController.add);
routes.get('/', authtoken, categoryController.getCategory);
routes.post('/edit', authtoken, categoryController.categoryEdit);
routes.post('/update', authtoken,upload,categoryController.updateCategory);
routes.get('/active', authtoken, categoryController.getActiveCategories);

module.exports = routes;
