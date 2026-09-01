import express from 'express';
import http from "http";
import { initSocket, getIO } from "./socket";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import tagsRouter from './routes/tags';
import subscriptionsRouter from './routes/subscriptions';
import { validate } from './middleware/validate';
import messageRoutes from "./routes/messages";
import statsRouter from './routes/statistics';
import conversationRoutes from './routes/conversation';
import statisticsRoutes from './routes/statistics';
import notificationRoutes from './routes/notification';

const app = express();


// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Auth: ${!!req.headers.authorization}`);
  next();
});
app.use(
  '/api/subscriptions/webhook',
  express.raw({ type: 'application/json' }),
  subscriptionsRouter
);

require('dotenv').config({ override: true });
console.log('✅ .env loaded:', {
  hasJWT: !!process.env.JWT_SECRET,
  hasStripe: !!process.env.STRIPE_SECRET_KEY,
  hasDB: !!process.env.DB_HOST,
  port: process.env.PORT || 3000
});

// Routes
app.use('/api', statsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/tags', tagsRouter);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/customers', customerRoutes);

app.use(errorHandler);

//server
const server = http.createServer(app);
initSocket(server);
app.set('io', getIO());

// ✅ Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
});

export default app;