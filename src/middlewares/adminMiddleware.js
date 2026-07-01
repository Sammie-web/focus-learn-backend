import { USER_ROLES } from '../config/constants.js';
import { sendError } from '../utils/responseFormatter.js';

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    return sendError(res, 'Forbidden', ['Admin access required'], 403);
  }
  return next();
};

export default adminMiddleware;
