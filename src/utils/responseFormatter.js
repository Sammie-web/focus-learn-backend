export const sendSuccess = (res, message = 'Request successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res, message = 'Request failed', errors = [], statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message, errors });
};
