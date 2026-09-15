import 'dotenv/config';

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { initSocket } from './socket';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import tagsRouter from './routes/tags';
import subscriptionsRouter from './routes/subscriptions';
import messageRoutes from './routes/messages';
import conversationRoutes from './routes/conversation';
import notificationRoutes from './routes/notification';
import statisticsRoutes from './routes/statistics';

const app = express();


// ==========================
// SECURITY
// ==========================

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      'http://localhost:4200',
    credentials: true
  })
);


// ==========================
// RATE LIMITING
// ==========================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);


// ==========================
// LOGGING
// ==========================

app.use(morgan('combined'));


// ==========================
// HEALTH CHECK
// ==========================

app.get(
  '/api/health',
  (_req, res) => {

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString()
    });

  }
);


// ==========================
// STRIPE WEBHOOK
// IMPORTANTE:
// DEBE IR ANTES DE express.json()
// ==========================

app.use(
  '/api/subscriptions/webhook',
  express.raw({
    type: 'application/json'
  })
);


// ==========================
// BODY PARSING
// ==========================

app.use(
  express.json({
    limit: '1mb'
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb'
  })
);


// ==========================
// ROUTES
// ==========================

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/tags',
  tagsRouter
);

app.use(
  '/api/conversations',
  conversationRoutes
);

app.use(
  '/api/messages',
  messageRoutes
);

app.use(
  '/api/subscriptions',
  subscriptionsRouter
);

app.use(
  '/api/notifications',
  notificationRoutes
);

app.use(
  '/api/statistics',
  statisticsRoutes
);

app.use(
  '/api/customers',
  customerRoutes
);


// ==========================
// ERROR HANDLER
// ==========================

app.use(errorHandler);


// ==========================
// SERVER
// ==========================

const server = http.createServer(app);

initSocket(server);

const PORT =
  Number(process.env.PORT) || 3000;

server.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
      `📡 Socket.io ready`
    );

  }
);

export default app;