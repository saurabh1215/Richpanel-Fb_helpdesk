const User = require('mongoose').model('userModel');
const mongoose = require('mongoose');
require('../models/userModel');
const jwt =  require('jsonwebtoken');
// const {facebookConnect} = require('./facebookController')

const createUser = async(req,res,next) => {
    try {
        let requestData = req.body;
        console.log(requestData)
        let newUser = new User({
            name : requestData.name,
            email : requestData.email,
            password : requestData.password,
        })
        const user = await newUser.save();
        console.log(user);

        if(!user) {
            throw error
        }
        return res.status(200).json({
            "success":true,
            "message": "User Created Successfully"
        })

    } catch (error) {
        next(error);
    }
}

const userLogin = async(req,res,next) => {
    try {

        const requestData = req.body;
        const user = await User.findOne({email:requestData.email});
        if(!user) {
            return res.status(401).json({
                "success":false,
                "message":"Invalid Email or Password"
            })
        }

        const token = user.generatAuthToken();
        res.cookie('auth-token',token,{ httpOnly: true, sameSite: 'strict', secure: false });

        return res.status(200).json({
            "success":true,
            "message":"Login Successful",
            token
        })

    } catch (error) {
        next(error);
    }
}

const connectFacebookPage = async(req,res,next)=> {
    
    try {

        // const pageDetails = await facebookConnect();

    } catch (error) {
        next(error);
    }

}
module.exports = {
    createUser,
    userLogin,
}