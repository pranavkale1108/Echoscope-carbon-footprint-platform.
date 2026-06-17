import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import actionRoutes from './routes/actionRoutes.js';

// Load environmental variables
dotenv.config();

// Establish Database Connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', actionRoutes);
// Fallback routing compatibility for Netlify rewrites
app.use('/.netlify/functions/api', actionRoutes);
app.use('/', actionRoutes);

// Base route for status verification
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Echoscope backend service is active' });
});

// Wildcard Page Not Found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Unhandled Error] ${err.stack}`);
  res.status(500).json({ error: 'Internal server error encountered' });
});

export default app;
