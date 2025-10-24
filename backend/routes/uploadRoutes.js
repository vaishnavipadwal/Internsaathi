import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure Multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- NEW: Public route for registration uploads (NO TOKEN REQUIRED) ---
// This route will be used by your RegisterPage.
router.post('/register', upload.single('image'), uploadImage);

// --- EXISTING: Protected route for logged-in users ---
// This route is used for things like updating a profile picture.
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
