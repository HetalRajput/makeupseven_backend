const { validationResult } = require('express-validator');
const userModels = require('../models/userModel');
const bookingModel = require('../models/bookingModel');
const path = require('path');
const jwt = require('jsonwebtoken');
const { log } = require('console');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({ errors: errorMessages });
    }

    const {name, contactNo, address,email} = req.body;

    try {    
        const profileImage = req.files?.profileImage?.[0]?.filename || null;
        const document = req.files?.documents?.[0]?.filename || null;
       

        // const hashedPassword = await bcrypt.hash(password, 10);
        const userData = new userModels({
            name:name,
            contactNo: contactNo,
            address: address,
            email: email,
            role : 'partner',
            profileImage: profileImage,
            document: document,
        })
        const saveUser =await userData.save();
        if(saveUser){
            res.status(200).send({ message: "Partner successfully registered", success: true });
        }
    } catch (error) {
        res.status(500).send({message: error.message, success: false});   
    }
}

const getVendor = async(req, res) => {
    try {
        const { role } = req.body;

        // const users = await userDetail.find({"age":497}).populate('user_id');
        const users = await userModels.find({"role": role});
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const data = users.map((user) => {
                const profileImageFilename = user.profileImage || null;
                const documentFilename = user.document || null;
                const profileImageUrl = profileImageFilename ? `${baseUrl}/uploads/img/${profileImageFilename}` : null;
                const documentUrl = documentFilename ? `${baseUrl}/uploads/document/${documentFilename}` : null;
                return {
                    id: user._id,
                    name: user.name,
                    contactNo: user.contactNo,
                    address: user.address,
                    email: user.email,
                    role: user.role,
                    profileImage: profileImageUrl,
                    document: documentUrl,
                    status: user.status,
                };
            });
        res.status(200).send({ message: "Partner data get successful", data: data, success: true });            

        // res.json(users); 
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const editVendor = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModels.findOne({ _id: id });
        if (!user) {
            return res.status(404).send({ message: 'User not found.', success: false });
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const profileImageFilename = user.profileImage || null;
        const documentFilename = user.document || null;
        const profileImageUrl = profileImageFilename ? `${baseUrl}/uploads/img/${profileImageFilename}` : null;
        const documentUrl = documentFilename ? `${baseUrl}/uploads/document/${documentFilename}` : null;
        
        const userData = {
            id: user._id,
            name: user.name,
            contactNo: user.contactNo,
            address: user.address,
            email: user.email,
            role: user.role,
            profileImage: profileImageUrl,
            document: documentUrl,
            status: user.status,
        };
        res.status(200).send({ message: "Partner data get successful", data: userData, success: true });
       
    } catch (error) {
        res.status(500).send({message: error.message, success: false});
    }
}

const updateVendor = async (req, res) => {
    try {

        const {id, name, contactNo, address, email, status } = req.body;
        const user = await userModels.findOne({ _id: id });
        if (!user) {
            return res.status(404).send({ message: 'Partner not found.', success: false });
        }   

        const profileImage = req.files?.profileImage?.[0]?.filename || user.profileImage;
        const document = req.files?.documents?.[0]?.filename || user.document;
        const userData = new userModels({
            _id: id,
            name:name,
            contactNo: contactNo,
            address: address,
            email: email,
            profileImage: profileImage,
            document: document,
            role: 'partner',
            status: status,
        })
        
        const updatedUser =await userModels.updateOne({_id:id}, {$set:userData});

        res.status(200).send({ message: "Partner updated successfully", success: true });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
}

const updatePartnerStatus = async (req, res) => {
    const userId = req.user.userId; // Ensure userId is available in req.user
    const { status } = req.body;
    try {
        const user = await userModels.findOne({ _id: userId, role: "partner" });
        if (!user) {
            return res.status(404).json({ message: 'Partner not found', success: false });
        }
        user.status = status;
        await user.save();
        return res.status(200).json({ message: 'Partner status updated successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}
const getSlot = async (req, res) => {
  try {
        const bookedSlots = await bookingModel.find({ status: "pending" }).select("slotId");
        const bookedSlotIds = bookedSlots.map(b => b.slotId);
       
        const userData = await userModels
        .find({
            role: "partner",
            status: "active"
        })
        .populate({
            path: "slot_id",
            match: { _id: { $nin: bookedSlotIds } }, // remove booked slots
            select: "time"
        });
        res.status(200).send({ message: "Partner list get successful", data: userData, success: true });

  } catch (error) {
    return res.status(404).json({
      errors: [error.message]
    });
  }
}
    
module.exports= {register, getVendor, editVendor, updateVendor, updatePartnerStatus, getSlot};