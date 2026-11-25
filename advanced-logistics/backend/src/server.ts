// Backend server entry point for Advanced Intelligent Logistics Management System
import express, { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import cors from 'cors';
import { config } from './config/index.js';
import { router } from './routes/index.js';
import { InventoryError } from './services/inventory.service.js';

export const app = express();

// Restricted CORS — allow only the configured frontend origin
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(router);
app.use(((error, _req, res, _next) => {
  if (error instanceof InventoryError) {
    res.status(error.statusCode).json({ error: 'Inventory Error', message: error.message });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    res.status(409).json({ error: 'Conflict', message: 'A record with that code or SKU already exists' });
    return;
  }
  console.error('[Request Error]', error);
  res.status(500).json({ error: 'Internal Server Error', message: 'The request could not be completed' });
}) as ErrorRequestHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[Advanced Logistics Backend] Server running on port ${config.port}`);
  });
}

export default app;
