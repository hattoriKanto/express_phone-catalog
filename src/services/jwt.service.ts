import jwt from 'jsonwebtoken';
import { NormalizedUser } from '../types/User';

function generateAccessToken(user: NormalizedUser) {
  return jwt.sign(user, process.env.JWT_KEY!, { expiresIn: '200s' });
}

function generateRefreshToken(user: NormalizedUser) {
  return jwt.sign(user, process.env.JWT_REFRESH_KEY!, { expiresIn: '30d' });
}

function validateAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY!);
  } catch (error) {
    return null;
  }
}

function validateRefreshToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY!);
  } catch (error) {
    return null;
  }
}

export const jwtService = {
  generateAccessToken,
  generateRefreshToken,
  validateAccessToken,
  validateRefreshToken,
};
