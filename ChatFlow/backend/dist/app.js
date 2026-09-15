"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const socket_1 = require("./socket");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const customers_1 = __importDefault(require("./routes/customers"));
const tags_1 = __importDefault(require("./routes/tags"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const messages_1 = __importDefault(require("./routes/messages"));
const conversation_1 = __importDefault(require("./routes/conversation"));
const notification_1 = __importDefault(require("./routes/notification"));
const statistics_1 = __importDefault(require("./routes/statistics"));
const app = (0, express_1.default)();
// ==========================
// SECURITY
// ==========================
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ||
        'http://localhost:4200',
    credentials: true
}));
// ==========================
// RATE LIMITING
// ==========================
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use(limiter);
// ==========================
// LOGGING
// ==========================
app.use((0, morgan_1.default)('combined'));
// ==========================
// HEALTH CHECK
// ==========================
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
// ==========================
// STRIPE WEBHOOK
// IMPORTANTE:
// DEBE IR ANTES DE express.json()
// ==========================
app.use('/api/subscriptions/webhook', express_1.default.raw({
    type: 'application/json'
}));
// ==========================
// BODY PARSING
// ==========================
app.use(express_1.default.json({
    limit: '1mb'
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '1mb'
}));
// ==========================
// ROUTES
// ==========================
app.use('/api/auth', auth_1.default);
app.use('/api/tags', tags_1.default);
app.use('/api/conversations', conversation_1.default);
app.use('/api/messages', messages_1.default);
app.use('/api/subscriptions', subscriptions_1.default);
app.use('/api/notifications', notification_1.default);
app.use('/api/statistics', statistics_1.default);
app.use('/api/customers', customers_1.default);
// ==========================
// ERROR HANDLER
// ==========================
app.use(errorHandler_1.errorHandler);
// ==========================
// SERVER
// ==========================
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📡 Socket.io ready`);
});
exports.default = app;
/*
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
*/ 
