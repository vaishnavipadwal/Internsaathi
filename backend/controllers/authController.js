import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to prepare user data for response
const getUserResponseData = (user) => {
  const baseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };

  if (user.role === 'company') {
    return { 
        ...baseData, 
        companyName: user.companyName, 
        companyDescription: user.companyDescription,
        companyLogo: user.companyLogo,
        verificationStatus: user.verificationStatus,
    };
  } else if (user.role === 'college') {
    return { 
        ...baseData, 
        collegeName: user.collegeName, 
        collegeLocation: user.collegeLocation,
        // --- FIX: Added the missing collegeLogo field ---
        collegeLogo: user.collegeLogo, 
    };
  } else if (user.role === 'student') {
    return { 
        ...baseData, 
        studentId: user.studentId, 
        major: user.major, 
        resume: user.resume, 
        profilePicture: user.profilePicture, 
        collegeName: user.collegeName 
    };
  }
  return baseData;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, companyName, companyDescription, collegeName, collegeLocation, studentId, major, verificationDocument, companyLogo, collegeLogo } = req.body;

    if (!name || !email || !password || !role) {
        res.status(400);
        throw new Error('Please enter all required fields.');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const userData = { name, email, password, role };

    if (role === 'company') {
        userData.companyName = companyName;
        userData.companyDescription = companyDescription;
        userData.verificationDocument = verificationDocument;
        userData.verificationStatus = 'pending';
        if (companyLogo) userData.companyLogo = companyLogo;
    } else if (role === 'college') {
        userData.collegeName = collegeName;
        userData.collegeLocation = collegeLocation;
        if (collegeLogo) userData.collegeLogo = collegeLogo;
    } else if (role === 'student') {
        userData.studentId = studentId;
        userData.major = major;
        userData.collegeName = collegeName;
    }

    const user = await User.create(userData);

    if (user) {
        res.status(201).json(getUserResponseData(user));
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(getUserResponseData(user));
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (user.role === 'company') {
      user.companyName = req.body.companyName || user.companyName;
      user.companyDescription = req.body.companyDescription || user.companyDescription;
      if (req.body.companyLogo !== undefined) {
          user.companyLogo = req.body.companyLogo;
      }
    } else if (user.role === 'college') {
      user.collegeName = req.body.collegeName || user.collegeName;
      user.collegeLocation = req.body.collegeLocation || user.collegeLocation;
      if (req.body.collegeLogo !== undefined) {
          user.collegeLogo = req.body.collegeLogo;
      }
    } else if (user.role === 'student') {
      user.studentId = req.body.studentId || user.studentId;
      user.major = req.body.major || user.major;
      user.resume = req.body.resume;
      user.collegeName = req.body.collegeName || user.collegeName;
      if (req.body.profilePicture !== undefined) {
          user.profilePicture = req.body.profilePicture;
      }
    }

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    
    const updatedUser = await user.save();
    
    res.status(200).json(getUserResponseData(updatedUser));

  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Get all students from the authenticated college
// @route   GET /api/auth/college/students
// @access  Private (College only)
const getCollegeStudents = asyncHandler(async (req, res) => {
    if (req.user.role !== 'college') {
        res.status(403);
        throw new Error('Not authorized to view this resource.');
    }

    const students = await User.find({ 
        role: 'student', 
        collegeName: req.user.collegeName 
    }).select('-password');

    res.status(200).json(students);
});


export {
  registerUser,
  loginUser,
  updateUserProfile,
  getCollegeStudents,
};
