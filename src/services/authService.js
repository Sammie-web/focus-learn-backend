import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import { USER_ROLES } from '../config/constants.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import env from '../config/env.js';

class AuthService {
  async registerUser(payload) {
    const existingUser = await userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw Object.assign(new Error('Email is already registered'), { statusCode: 409 });
    }

    const user = await userRepository.create({
      ...payload,
      role: USER_ROLES.STUDENT,
      status: 'active',
      group: null,
    });

    return this.issueTokens(user);
  }

  async loginUser(credentials) {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    return this.issueTokens(user);
  }

  async adminLogin(credentials) {
    const user = await userRepository.findByEmail(credentials.email);
    if (!user || user.role !== USER_ROLES.ADMIN) {
      throw Object.assign(new Error('Invalid admin credentials'), { statusCode: 401 });
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid admin credentials'), { statusCode: 401 });
    }

    return this.issueTokens(user);
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  }

  async refreshToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);
    const user = await userRepository.findById(decoded.id);

    if (!user || !user.refreshToken) {
      throw Object.assign(new Error('Refresh token is invalid'), { statusCode: 401 });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw Object.assign(new Error('Refresh token is invalid'), { statusCode: 401 });
    }

    return this.issueTokens(user);
  }

  async issueTokens(user) {
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });
    const hashedRefresh = await bcrypt.hash(refreshToken, 12);
    await userRepository.updateById(user._id, { refreshToken: hashedRefresh });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
