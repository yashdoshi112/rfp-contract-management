// @ts-nocheck
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

import prisma from './prisma.js';
import { authRouter } from './routes/auth.js';
import { rfpRouter } from './routes/rfp.js';
import { responseRouter } from './routes/response.js';
import { setupSwagger } from './swagger.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'] }
});
app.set('io', io);

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'], credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

// static uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api/rfps', rfpRouter);
app.use('/api', responseRouter);

setupSwagger(app);

const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
  console.log(`API on http://localhost:${port}`);
});

