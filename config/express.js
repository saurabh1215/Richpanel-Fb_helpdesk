const express = require('express');
const cookieParser = require('cookie-parser'); 
const errorHandler = require('../app/utils/errorHandler')
let cors = require('cors')


const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001','https://www.facebook.com,http://ec2-13-53-83-2.eu-north-1.compute.amazonaws.com,*.amazonaws.com'],
  // origin: ['*'],

  credentials: true
};

module.exports = () => {
    let app = express();

    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(cookieParser());
    app.use('/user', require('../app/routes/userRoutes'));
    app.use('/', require('../app/routes/facebookRoutes'));

    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body',
          });
        }
    
        next(err);
      });

    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).send('Something went wrong!');
    // });
    app.use(errorHandler);


    return app;
};
