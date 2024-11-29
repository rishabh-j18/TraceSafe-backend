const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nickname: { type: String },
  dateOfBirth: { type: Date, required: true },
  aadhar:{ type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  photo: { type: String }, // URL or path to the uploaded photo
  height: { type: String, required: true },
  weight: { type: String, required: true },
  eyeColor: { 
    type: String, 
    enum: ['brown', 'blue', 'green', 'hazel', 'gray'], 
    required: true 
  },
  hairColor: { 
    type: String, 
    enum: ['black', 'brown', 'blonde', 'red', 'gray', 'white'], 
    required: true 
  },
  distinguishingFeatures: { type: String },
  
  // Last seen information
  lastSeenDate: { type: String, required: true },
  lastSeenLocation: { type: String, required: true },
  clothingDescription: { type: String },
  circumstances: { type: String },

  // Reporter information
  reporterName: { type: String, required: true },
  relationship: { 
    type: String, 
    enum: ['parent', 'sibling', 'friend', 'other'], 
    required: true 
  },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },

  // Additional information
  reward: { type: String },
  medicalConditions: { type: String },
  languagesSpoken: { type: String },
  otherInfo: { type: String },

  blockchainRecord: [
    { transactionId: String, reportCount: Number, timestamp: Date }
  ],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamps on save
missingPersonSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
