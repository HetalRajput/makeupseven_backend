
const userModels = require('../models/userModel');

const {body, checkSchema, validationResult} = require('express-validator');

const registrationSchema = {
    name: {
        custom: {
            options: value => {
                return userModels.find({
                    name: value
                }).then(user => {
                    if (user.length > 0) {
                        return Promise.reject('Username already in use')
                    }
                })
            }
        },
        notEmpty: true,
        errorMessage: "Name field cannot be empty"
    },
    contactNo: {
        custom: {
            options: value => {
                return userModels.find({
                    contactNo: value
                }).then(contactNo => {
                    if (contactNo.length > 0) {
                        return Promise.reject('Contact No already in use')
                    }
                })
            }
        },
        notEmpty: true,
        errorMessage: "Contact No cannot be empty"
    },
    email: {
        custom: {
            options: value => {
                return userModels.find({
                    email: value
                }).then(email => {
                    if (email.length > 0) {
                        return Promise.reject('Email already in use')
                    }
                })
            }
        },
        notEmpty: true,
        errorMessage: "Email cannot be empty"
    },
    address: {
        notEmpty: true,
        errorMessage: "Address cannot be empty"
        // normalizeEmail: true,
        // custom: {
        //     options: value => {
        //         return User.find({
        //             email: value
        //         }).then(user => {
        //             if (user.length > 0) {
        //                 return Promise.reject('Email address already taken')
        //             }
        //         })
        //     }
        // }
    },
};
module.exports = {
    registrationSchema: checkSchema(registrationSchema)
};