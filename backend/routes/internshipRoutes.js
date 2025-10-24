import { Router } from 'express';
import {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getMyInternships,
} from '../controllers/internshipController.js';
// --- FIX: Import the new isCompanyApproved middleware ---
import { protect, authorizeRoles, isCompanyApproved } from '../middleware/authMiddleware.js';

const router = Router();

// Public route for getting all internships (with search/filters)
router.get('/', getInternships);

// Private route for getting MY internships (MUST be before the dynamic /:id route)
router.get('/my-internships', protect, authorizeRoles('company'), getMyInternships);

// --- FIX: Apply the isCompanyApproved middleware to this route ---
// Now, only companies with an 'approved' status can create an internship.
router.post('/', protect, authorizeRoles('company'), isCompanyApproved, createInternship);

// Dynamic public route for getting a single internship by ID
router.get('/:id', getInternshipById);

// Dynamic private routes for updating and deleting by ID
// Note: You might want to add isCompanyApproved here as well to prevent
// unapproved companies from editing/deleting old posts.
router.put('/:id', protect, authorizeRoles('company'), updateInternship);
router.delete('/:id', protect, authorizeRoles('company'), deleteInternship);

export default router;
