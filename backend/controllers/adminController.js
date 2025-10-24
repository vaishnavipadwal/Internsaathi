// File: backend/controllers/adminController.js

import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all companies pending verification
// @route   GET /api/admin/pending-companies
// @access  Private (Admin only)
const getPendingCompanies = asyncHandler(async (req, res) => {
  // --- FIX: Explicitly select the fields to send to the frontend ---
  // This ensures the verificationDocument URL is always included.
  const pendingCompanies = await User.find({ 
    role: 'company', 
    verificationStatus: 'pending' 
  }).select('companyName email verificationDocument');
  
  res.status(200).json(pendingCompanies);
});

// @desc    Update a company's verification status
// @route   PUT /api/admin/verify-company/:id
// @access  Private (Admin only)
const updateVerificationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // Expecting 'approved' or 'rejected'

  if (!status || !['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided.');
  }

  const company = await User.findById(req.params.id);

  if (company && company.role === 'company') {
    company.verificationStatus = status;
    await company.save();
    res.status(200).json({ message: `Company has been ${status}.` });
  } else {
    res.status(404);
    throw new Error('Company not found.');
  }
});

export { getPendingCompanies, updateVerificationStatus };
