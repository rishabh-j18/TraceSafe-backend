const express = require('express');
const multer = require('multer');
const path = require('path');
const MissingPerson = require('../models/missingPersonModel');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST route to save a new report
router.post('/submit', upload.single('photo'), async (req, res) => {
  try {
    const { body, file } = req;

    const newReport = new MissingPerson({
      ...body,
      photo: file ? file.path : '',
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting report', error });
  }
});

module.exports = router;
