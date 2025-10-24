// File: backend/controllers/availabilityController.js

import asyncHandler from 'express-async-handler';
import Availability from '../models/Availability.js';

// @desc    Create a new availability period
// @route   POST /api/availability
// @access  Private (College only)
const createAvailability = asyncHandler(async (req, res) => {
  // Only colleges can create availability
  if (req.user.role !== 'college') {
    res.status(403);
    throw new Error('Only colleges can set availability.');
  }

  const { name, startDate, endDate } = req.body;

  // Validate input
  if (!name || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide a name, start date, and end date.');
  }

  // Create new availability period
  const availability = await Availability.create({
    college: req.user._id, // attach authenticated college
    name,
    startDate,
    endDate,
  });

  res.status(201).json(availability);
});

// @desc    Get all availability periods for a college
// @route   GET /api/availability
// @access  Private (College only)
const getAvailability = asyncHandler(async (req, res) => {
  if (req.user.role !== 'college') {
    res.status(403);
    throw new Error('Only colleges can view availability.');
  }

  const periods = await Availability.find({ college: req.user._id }).sort({ startDate: 1 });
  res.status(200).json(periods);
});

// @desc    Delete an availability period
// @route   DELETE /api/availability/:id
// @access  Private (College only)
const deleteAvailability = asyncHandler(async (req, res) => {
  if (req.user.role !== 'college') {
    res.status(403);
    throw new Error('Only colleges can delete availability.');
  }

  const period = await Availability.findById(req.params.id);

  if (!period) {
    res.status(404);
    throw new Error('Availability period not found.');
  }

  // Ensure the authenticated college owns this period
  if (period.college.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this period.');
  }

  await period.deleteOne();
  res.status(200).json({ message: 'Availability period removed.' });
});

export { createAvailability, getAvailability, deleteAvailability };
