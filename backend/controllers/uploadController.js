import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';
import streamifier from 'streamifier';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload a file (image or PDF)
// @route   POST /api/upload OR /api/upload/register
// @access  Public or Private
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file provided.');
  }

  // --- FIX: Use a stream to upload the file buffer directly ---
  // This is more robust and allows Cloudinary to handle different file types.
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'internsaathi_uploads',
      // Tell Cloudinary to automatically detect the file type (image, pdf, etc.)
      resource_type: 'auto', 
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500);
        throw new Error('File upload to Cloudinary failed.');
      }
      
      // Send the secure URL back to the frontend
      res.status(200).json({
        message: 'File uploaded successfully',
        imageUrl: result.secure_url,
      });
    }
  );

  // Pipe the file buffer from multer into the Cloudinary upload stream
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

export { uploadImage };
