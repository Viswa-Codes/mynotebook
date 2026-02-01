import connectToMongo from './db';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';

connectToMongo();

const app = express(); //Create an Express application instance
const port = 5000;

// Middlewares
app.use(cors()); //Frontend:3000 & Backend:5000 --> But CORS error occurs without use(cors())
app.use(express.json()); //reads JSON data from incoming requests, converts them into JS objects, and makes them available as req.body.

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Global Error Handler (Must be last)
app.use(errorHandler);//error handler catches errors passed using next(err) in controllers

// Start the server

app.listen(port, () => {
  console.log(`myNotebook backend listening on port at http://localhost:${port}`);
});
