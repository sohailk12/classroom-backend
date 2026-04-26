import express from 'express';
import cors from 'cors';

import subjectsRouter from './routes/subjects.js';
const app = express();
const PORT = 8000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());

app.use('/api/subjects', subjectsRouter);

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express Server!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

