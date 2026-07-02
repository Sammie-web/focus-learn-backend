import authService from '../services/authService.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, 'Registration successful', result, 201);
  } catch (error) {
    next(error);
  }
};

export const adminRegister = async (req, res, next) => {
  try {
    const { adminSecret, ...userData } = req.body;
    const result = await authService.adminRegister(userData, adminSecret);
    return sendSuccess(res, 'Admin registration successful', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const result = await authService.adminLogin(req.body);
    return sendSuccess(res, 'Admin login successful', result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return sendSuccess(res, 'Current user fetched', user);
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token required', ['Refresh token is required'], 400);
    }
    const result = await authService.refreshToken(refreshToken);
    return sendSuccess(res, 'Token refreshed', result);
  } catch (error) {
    next(error);
  }
};
