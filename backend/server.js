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

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Echoscope service running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default server;
