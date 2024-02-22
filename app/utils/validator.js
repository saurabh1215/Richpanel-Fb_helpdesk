const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const mongoose = require('mongoose')


const validateCreateUser = [
   check('name').trim().notEmpty().withMessage('Name is required'),
   check('email').trim().isEmail().withMessage('Invalid email format'),
   check('password').trim().notEmpty().withMessage('Password is required'),
];

const validateUserLogin = [
   check('email').trim().isEmail().withMessage('Invalid email format'),
   check('password').trim().notEmpty().withMessage('Password is required'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({
          success: false,
          errors: errors.array(),
       });
    }
    next();
 };

const handleParameter = (req,res,next) => {
   try {
      // console.log('in')
      const param = req.params.id
      if (!mongoose.Types.ObjectId.isValid(param)) {
         return res.status(400).json({
           success: false,
           message: 'Invalid ID format',
         });
       }
       next();

   } catch (error) {
      next(error);
   }
}
 module.exports = {
    handleValidationErrors,
    validateUserLogin,
    validateCreateUser,
    handleParameter
 }