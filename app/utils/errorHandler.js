const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 
 
    if (res.headersSent) {
       return next(err);
    }
 
    if (err.name === 'ValidationError') {
       return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: err.errors,
       });
    }
 
    return res.status(500).json({
       success: false,
       message: 'Internal Server Error',
    });
 };
 
 module.exports = errorHandler;
 