const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userModels = require('../models/userModel');
const otpModels = require('../models/otpModel');
const path = require('path');
const jwt = require('jsonwebtoken');
const { log } = require('console');


const login = async (req, res) => {
   
    const {email,password} = req.body;

    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const data = await userModels.findOne({email:email});
        
        if (!data) {
            return res.status(404).send({ message: "User not found", success: false });
        }
        
        var passwordIsValid = bcrypt.compareSync(password,data.password);
        if(!passwordIsValid){
            res.status(500).send("password is invalid");
        }else{
            const token = jwt.sign({ userId: data._id }, JWT_SECRET, { expiresIn: '7d' });
            res.status(200).send({ message: "Login successful", token, success: true });            
        }
        
    } catch (error) {
        res.status(500).send({message: error.message, success: false});
    }
}


const getUsers = async(req, res) => {
    try {
        const { role } = req.body;

        // const users = await userDetail.find({"age":497}).populate('user_id');
        const users = await userModels.find({"role": role});
        res.status(200).send({ message: "User data get successful", data: users, success: true });            

        // res.json(users); 
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};



const registration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    }
    const {name, contactNo, address,email,role} = req.body;

    try {    

        // const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new userModels({
            name:name,
            contactNo: contactNo,
            address: address,
            email: email,
            role : 'user',
        })
        const saveUser =await userData.save();
        if(saveUser){
            res.status(200).send({ message: "User successfully registered", success: true });
        }
    } catch (error) {
        res.status(500).send({message: error.message, success: false});   
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModels.findOne({ _id: id });
        if (!user) {
            return res.status(404).send({ message: 'User not found.', success: false });
        }
        res.status(200).send({ message: "User data get successful", data: user, success: true });            


    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
}


const updateUser = async (req, res) => {
    const {id, name, contactNo, address,email,role} = req.body;
    
    try {    
        const userData = new userModels({
            _id: id,
            name:name,
            contactNo: contactNo,
            address: address,
            email: email,
            role : 'user',
        })
        const saveUser =await userModels.updateOne({_id:id}, {$set:userData});
        res.status(200).send({ message: "Successfully updated user", success: true });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });   
    }
}


const appLogin = async (req, res) => {
    const {contactNo} = req.body;
    try {
        const data = await userModels.findOne({contactNo:contactNo});
        // const otp = Math.floor(1000 + Math.random() * 9000);
        const otp = 1234;
        if(!data){
            res.status(500).send({message: "data not found", success: false});
        }else{
            const otpData = new otpModels({
                contactNo: contactNo,
                otp: otp,
                status: true
            })
            const saveOtp =await otpData.save();
            res.status(200).send({ message: "Otp send successful", otp, success: true });            
        }
        
    } catch (error) {
        res.status(500).send({message: error.message, success: false});
    }
}

const verifyOtp = async (req, res) => {
  const { contactNo, otp } = req.body;

  try {
    const otpRecord = await otpModels.findOne({ contactNo, otp });
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!otpRecord) {
      return res.status(400).send({ message: "Invalid or expired OTP", success: false });
    }
    await otpModels.deleteOne({ _id: otpRecord._id });
    const data = await userModels.findOne({contactNo:contactNo});
    const token = jwt.sign({ userId: data._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).send({ message: "OTP verified successfully",token: token, user: data , success: true });

  } catch (error) {
    res.status(500).send({ message: error.message, success: false });
  }
}

const vendorRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    }
    const {name, contactNo, address,email,role} = req.body;

    try {    
        let imageFilename = null;
        if (req.file && req.file.filename) {
        imageFilename = req.file.filename;
        }


        // const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new userModels({
            name:name,
            contactNo: contactNo,
            address: address,
            email: email,
            role : role,
        })
        const saveUser =await userData.save();
        if(saveUser){
            res.status(200).send({ message: "User successfully registered", success: true });
        }
    } catch (error) {
        res.status(500).send({message: error.message, success: false});   
    }
}


module.exports= {getUsers,registration,updateUser,login,editUser,appLogin,verifyOtp,vendorRegister};