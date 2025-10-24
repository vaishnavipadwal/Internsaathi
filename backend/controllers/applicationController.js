import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const applyForInternship = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only student users can apply for internships.');
  }

  const { internshipId } = req.params;
  const { coverLetter, linkedinUrl, githubUrl } = req.body;
  const resumeFile = req.file;

  if (!coverLetter) {
    res.status(400);
    throw new Error('Please provide a cover letter for your application.');
  }

  if (!resumeFile) {
    res.status(400);
    throw new Error('Please upload a resume file.');
  }

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'internsaathi_resumes',
        resource_type: 'auto',
        public_id: `resume_${internshipId}_${req.user._id}`,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(new Error('File upload to Cloudinary failed.'));
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });

  const resumeUrl = uploadResult.secure_url;

  const internship = await Internship.findById(internshipId);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found.');
  }

  const existingApplication = await Application.findOne({
    internship: internshipId,
    applicant: req.user._id,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this internship.');
  }

  const collegeUser = await User.findOne({
    role: 'college',
    collegeName: req.user.collegeName,
  });

  const application = await Application.create({
    internship: internshipId,
    applicant: req.user._id,
    company: internship.company,
    college: collegeUser ? collegeUser._id : null,
    coverLetter,
    resumeUrl,
    linkedinUrl,
    githubUrl,
    status: 'Pending',
  });

  internship.applicants.push(req.user._id);
  await internship.save();

  res.status(201).json({ message: 'Application submitted successfully!', application });
});

const getCompanyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can view applications for their internships.');
  }

  const applications = await Application.find({ company: req.user._id })
    .populate('internship', 'title companyName location')
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const getStudentApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only student users can view their submitted applications.');
  }

  const applications = await Application.find({ applicant: req.user._id })
    .populate('internship', 'title companyName location applicationDeadline')
    .populate('company', 'name email companyName');

  res.status(200).json(applications);
});

const getCollegeApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'college') {
    res.status(403);
    throw new Error('Only college users can view applications for their students.');
  }

  const applications = await Application.find({ college: req.user._id })
    .populate('internship', 'title companyName location')
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const getInternshipApplicants = asyncHandler(async (req, res) => {
  const { internshipId } = req.params;

  const internship = await Internship.findById(internshipId);

  if (!internship) {
    res.status(404);
    throw new Error('Internship not found.');
  }

  if (internship.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this internship.');
  }

  const applications = await Application.find({ internship: internshipId })
    .populate('applicant', 'name email studentId major');

  res.status(200).json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'company') {
    res.status(403);
    throw new Error('Only company users can update application status.');
  }

  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id).populate('internship', 'applicationDeadline');

  if (!application) {
    res.status(404);
    throw new Error('Application not found.');
  }

  if (!application.internship) {
      res.status(404);
      throw new Error('The internship associated with this application no longer exists.');
  }

  if (application.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application.');
  }

  const now = new Date();
  if (now > application.internship.applicationDeadline && status === 'Accepted') {
      res.status(400);
      throw new Error('The application deadline has passed. You can no longer accept this application.');
  }

  const validStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid application status provided.');
  }

  application.status = status;
  await application.save();

  res.status(200).json({ message: 'Application status updated successfully!', application });
});
const downloadResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await Application.findById(id).populate('applicant', 'name');

  if (!application) {
    res.status(404);
    throw new Error('Application not found.');
  }

  // Only the company who owns the internship can download
  if (application.company.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this application.');
  }

  if (!application.resumeUrl) {
    res.status(404);
    throw new Error('Resume file not found for this application.');
  }

  try {
    // Redirect client to Cloudinary URL for download
    const urlParts = application.resumeUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1].split('?')[0]; // remove query string

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileNameWithExtension}"`
    );

    // Redirect the client directly to the Cloudinary URL
    res.redirect(application.resumeUrl);

  } catch (err) {
    console.error(`Failed to download resume: ${err.message}`);
    res.status(500).send('Failed to download resume.');
  }
});


export {
  applyForInternship,
  getCompanyApplications,
  getStudentApplications,
  getCollegeApplications,
  getInternshipApplicants,
  updateApplicationStatus,
  downloadResume,
};
