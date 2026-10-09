const express = require('express');
const routes = express.Router();

const userMiddleware =routes.use('/',(req,res,next) => {
    console.log("this is a middleware");
    next();
});
module.exports = userMiddleware;