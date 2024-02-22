require('dotenv').config();
require('./config/mongoose');
const User = require('mongoose').model('userModel')
const io = require('./config/socket'); // Import the Socket.io server module
const cors = require('cors');


let createExpressApp = require('./config/express'); 
let app = createExpressApp(); 
const port = process.env.PORT; 

app.listen(port,async ()=> {

    const users = await User.find();
    if(users.length==0) {
        const newUser = await new User({
            name : 'admin',
            email : 'admin@admin.com',
            password : '12345678'
        })
        let user = await newUser.save();
        console.log(user);
    }
    console.log(`Server started  At Port ${port}`)

})























// require('dotenv').config();
// require('./config/mongoose');
// const User = require('mongoose').model('userModel')
// const WebSocket = require('ws');


// let createExpressApp = require('./config/express'); 
// let app = createExpressApp(); 
// const port = process.env.PORT || 3000; 

// const server = app.listen(port,async ()=> {

//     const users = await User.find();
//     if(users.length==0) {
//         const newUser = await new User({
//             first_name : 'admin',
//             last_name : 'admin',
//             email : 'admin@admin.com',
//             password : '12345678'
//         })
//         let user = await newUser.save();
//         console.log(user);
//     }
//     console.log(`Magic Happens At Port ${port}`)

// })

// const wss = new WebSocket.Server({ noServer: true });

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   ws.on('message', (message) => {
//       console.log(`Received message: ${message}`);
//       // Handle WebSocket messages as needed
//   });

//   ws.on('close', () => {
//       console.log('Client disconnected');
//   });
// });

// // server.on('upgrade', (request, socket, head) => {
// //   wss.handleUpgrade(request, socket, head, (ws) => {
// //       wss.emit('connection', ws, request);
// //   });
// // });


// wss.broadcast = function broadcast(msg){
//   wss.clients.forEach(function each(client){
//     client.send(msg);
//   });
// };


// module.exports = {
//   server,
//   wss,
//   // broadcast1
// };