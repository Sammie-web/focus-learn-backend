import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import nasaRoutes from './routes/nasaRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import logRoutes from './routes/logRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import rateLimiter from './middlewares/rateLimiter.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import { sendError } from './utils/responseFormatter.js';

const app = express();

app.use(helmet());
const corsOptions = {
  origin: env.corsOrigin.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(mongoSanitize());
app.use(xss());

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FocusLearn API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/nasa-tlx', nasaRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  return sendError(res, 'Route not found', ['The requested resource was not found'], 404);
});

app.use(errorMiddleware);

export default app;
