import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const rateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
