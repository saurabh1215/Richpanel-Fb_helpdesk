const mongoose = require('mongoose');
require('../app/models/userModel');

const mongooseConnectionString = process.env.MONGO_DB_URL;

mongoose.connect(mongooseConnectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection.on('connected',()=> {
    console.log('Connected to Mongo DB')
});
