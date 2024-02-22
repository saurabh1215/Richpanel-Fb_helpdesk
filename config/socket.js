// socket.js
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Update with your frontend app URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A client connected');

  // Example: Emit a welcome message to the connected client
  socket.emit('welcome', 'Welcome to the Socket.io server');

  // Add other Socket.io events as needed

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

httpServer.listen(3001, () => {
  console.log('Socket.io server is running on port 3001');
});

module.exports = io;
