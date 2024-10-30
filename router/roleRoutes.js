// src/routes/roleRoutes.js
const express = require('express');
const { addUser, removeUser, isUser } = require('../controller/roleController');
const router = express.Router();

router.post('/add', addUser);
router.post('/remove', removeUser);
router.post('/isUser', isUser);

module.exports = router;
