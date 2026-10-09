const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userModels = require('../models/userModel');



const dashboard = async (req, res) => {
   
    try {
        const userCount = await userModels.countDocuments({ role: "user" });
        res.status(200).send({ message: "Dashboard data fetched successfully", data: { userCount }, success: true });
    } catch (error) {
        res.status(500).send({message: error.message, success: false});
    }
}


module.exports= {dashboard};