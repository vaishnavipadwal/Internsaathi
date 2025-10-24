import { Router } from 'express';
import multer from 'multer';
import {
  applyForInternship,
  getCompanyApplications,
  getStudentApplications,
  getCollegeApplications,
  getInternshipApplicants,
  updateApplicationStatus,
  downloadResume,
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Student-specific routes
router.post('/:internshipId', protect, authorizeRoles('student'), upload.single('resume'), applyForInternship);
router.get('/student/my-applications', protect, authorizeRoles('student'), getStudentApplications);

// Company-specific routes
router.get('/company/my-applications', protect, authorizeRoles('company'), getCompanyApplications);
router.get('/internship/:internshipId', protect, authorizeRoles('company'), getInternshipApplicants);
router.put('/:id/status', protect, authorizeRoles('company'), updateApplicationStatus);

// College-specific routes
router.get('/college/my-applications', protect, authorizeRoles('college'), getCollegeApplications);

// Route to handle resume downloads directly from the server
router.get('/:id/download', protect, authorizeRoles('company'), downloadResume);

export default router;
