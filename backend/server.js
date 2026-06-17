import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http'; // <-- ADD THIS
import connectDB from './config/db.js';
// ... import your routes here

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Your routes
app.use('/api/auth', authRoutes);
app.use('/api/actions', actionRoutes);

// REMOVE THIS PART:
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ADD THIS PART INSTEAD:
export const handler = serverless(app);