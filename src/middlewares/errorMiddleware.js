import { sendError } from '../utils/responseFormatter.js';

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return sendError(res, message, [message], statusCode);
};

export default errorMiddleware;
