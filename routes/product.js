const express = require('express');
const routes = express.Router();
const productController = require('../controllers/productController.js');
const productValidation = require('../validation/productValidation.js');
const upload = require('../middleware/multerConfig.js');
const authtoken = require('../middleware/authtoken.js');

routes.post('/add', authtoken, upload, productValidation, productController.add);
routes.get('/', authtoken, productController.get);
routes.post('/edit', authtoken, productController.edit);
routes.post('/update', authtoken, upload, productController.update);

routes.post('/addtocart', authtoken, productController.addToCart);
routes.get('/cartlist', authtoken, productController.cartList);
routes.post('/removefromcart', authtoken, productController.rmoveFromCart);
module.exports = routes;
