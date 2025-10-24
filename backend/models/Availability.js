// File: backend/models/Availability.js

import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Refers to your User model
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const Availability = mongoose.model('Availability', availabilitySchema);

export default Availability;