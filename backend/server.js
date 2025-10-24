import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import collegeRoutes from './routes/collegeRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect database
connectDB();

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend's address
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to Internsaathi API');
});

// Use authentication routes
app.use('/api/auth', authRoutes);
// Use internship routes
app.use('/api/internships', internshipRoutes);
// Use application routes
app.use('/api/applications', applicationRoutes); 
// Use college routes
app.use('/api/colleges', collegeRoutes);
// Use company routes
app.use('/api/companies', companyRoutes);
// Use upload routes for image uploads
app.use('/api/upload', uploadRoutes);
// Use availability routes for managing student availability
app.use('/api/availability', availabilityRoutes);
// Use admin routes for company verification
app.use('/api/admin', adminRoutes);

// Error handling middleware (MUST be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
