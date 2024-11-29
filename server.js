const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const connectDB = require('./db/db');
require('dotenv').config({ path: './.env' });

const roleRoutes = require('./router/roleRoutes');
const authRouter = require('./router/auth');
const notificationRoutes = require('./router/notificationRoutes');

// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Connect to the database
connectDB();

// Routes
app.use('/api/roles', roleRoutes);
app.use(authRouter);
app.use('/api', notificationRoutes);

// Home route (basic API test)
app.get('/', (req, res) => {
  res.send('API is running');
});

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server on the same HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // This is where you can send notifications to the client
  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  // Broadcast notifications to all connected clients
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Create broadcastNotification as a global function
global.broadcastNotification = function (notification) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(notification));
    }
  });
};

// Add this line at the end of app.js to make sure `broadcastNotification` is globally accessible
module.exports = { broadcastNotification };

// Example endpoint to send a notification (for testing)
app.post('/api/send-notification', (req, res) => {
  const { title, message } = req.body;
  const notification = { title, message };
  broadcastNotification(notification); // Send the notification to all clients
  res.status(200).json({ message: 'Notification sent successfully' });
});

// Set the port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
