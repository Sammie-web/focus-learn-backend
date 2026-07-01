import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../config/env.js';
import { sendError } from '../utils/responseFormatter.js';

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 'Unauthorized', ['Authentication token is missing'], 401);
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return sendError(res, 'Unauthorized', ['User no longer exists'], 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Unauthorized', ['Invalid or expired token'], 401);
  }
};

export default authMiddleware;
