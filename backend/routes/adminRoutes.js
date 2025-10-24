// File: backend/routes/adminRoutes.js

import express from 'express';
import { getPendingCompanies, updateVerificationStatus } from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only users with the 'admin' role can access these routes
router.use(protect, authorizeRoles('admin'));

router.route('/pending-companies').get(getPendingCompanies);
router.route('/verify-company/:id').put(updateVerificationStatus);

export default router;