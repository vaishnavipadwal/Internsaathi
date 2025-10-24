import express from 'express';
import User from '../models/User.js'; 
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all colleges with filtering and availability periods
// @route   GET /api/colleges
// @access  Private/Company
router.get('/', protect, authorizeRoles('company'), async (req, res) => {
  try {
    const { keyword, location } = req.query;

    const queryConditions = { role: 'college' };
    const andClause = [];

    if (keyword) {
      andClause.push({
        $or: [
          { collegeName: { $regex: keyword, $options: 'i' } },
          { collegeLocation: { $regex: keyword, $options: 'i' } },
        ],
      });
    }

    if (location) {
      andClause.push({
        collegeLocation: { $regex: location, $options: 'i' },
      });
    }

    if (andClause.length > 0) {
      queryConditions.$and = andClause;
    }

    // --- THE FIX IS HERE ---
    // We now populate the 'availabilityPeriods' virtual field to get the dates.
    const colleges = await User.find(queryConditions)
      .select('-password')
      .populate('availabilityPeriods'); // Fetches the related availability data
    
    // Map the results to the format the frontend expects.
    const formattedColleges = colleges.map(collegeUser => ({
        _id: collegeUser._id,
        name: collegeUser.collegeName,
        email: collegeUser.email, 
        collegeLogo: collegeUser.collegeLogo || '',
        location: {
            city: collegeUser.collegeLocation || 'N/A',
            state: ''
        },
        domains: [],
        // --- NEW: Include the availability periods in the response ---
        availabilityPeriods: collegeUser.availabilityPeriods || [], // Use a fallback
    }));

    res.json(formattedColleges);

  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).send('Server Error');
  }
});

export default router;
