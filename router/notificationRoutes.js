const express = require('express');
const router = express.Router();

// Endpoint to send a notification
router.post('/send-notification', (req, res) => {
  const { title, message } = req.body;
  
  // This is a placeholder; if you're using WebSocket or another service to send notifications, you might call that here.
  const notification = { title, message };

  // Ideally, you would integrate this with WebSocket or push notification logic
  global.broadcastNotification(notification);  // assuming broadcastNotification is defined in app.js

  res.status(200).json({ message: 'Notification sent successfully' });
});

module.exports = router;
