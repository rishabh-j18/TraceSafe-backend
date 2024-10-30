// models/Location.js

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true, // Either an address or coordinates string
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  dateTime: {
    type: Date,
    required: true,
  },
  photo: [
    {
      type: String, // URLs of uploaded photos
    },
  ],
  video: {
    type: String, // URL of the uploaded video
    default: null,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  reporterName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  witnessName: {
    type: String,
    maxlength: 100,
  },
  witnessContact: {
    type: String,
  },
  additionalNotes: {
    type: String,
    maxlength: 1000,
  },
  rewardCoins: {
    type: Number,
    default: 100, // Fixed reward for every submission
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the schema as a model
const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
