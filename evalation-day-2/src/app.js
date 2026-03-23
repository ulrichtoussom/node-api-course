import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import livreRoutes from './routes/livreRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares de base
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/livres', livreRoutes);

console.log("Ma clé secrète est :", process.env.JWT_SECRET);


app.use(errorHandler);

export default app;