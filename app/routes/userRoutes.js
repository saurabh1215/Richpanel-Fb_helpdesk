const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {validateUserLogin,validateCreateUser,handleValidationErrors} = require('../utils/validator')
const facebookController = require('../controllers/facebookController')
const {isAuthenticated} = require('../../config/middleware')


router.post("/login",validateUserLogin,handleValidationErrors,userController.userLogin);
router.post("/register",validateCreateUser,handleValidationErrors,userController.createUser);
router.get("/authCode",facebookController.facebookAccessToken);
router.get('/webhook',facebookController.facebookWebhook);
router.post('/webhook',facebookController.incomingFacebookWebhook);
router.post('/reply',isAuthenticated,facebookController.replyToUser);
router.get('/testLogin',facebookController.facebookLogin)

router.get('/fetch-conversation',isAuthenticated,facebookController.fetchDetail)


module.exports = router;