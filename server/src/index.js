import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import casesRouter from './routes/cases.js';

const app = express();
app.use(cors({ origin: (process.env.CLIENT_URL || '').split(',') }));
app.use(express.json({ limit: '50kb' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/cases', casesRouter);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong' });
});

await mongoose.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT || 5000, () => console.log('API running'));
