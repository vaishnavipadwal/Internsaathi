// File: backend/routes/availabilityRoutes.js

import express from 'express';
import { createAvailability, getAvailability, deleteAvailability } from '../controllers/availabilityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAvailability)
  .get(protect, getAvailability);
  
router.route('/:id')
    .delete(protect, deleteAvailability);

export default router;