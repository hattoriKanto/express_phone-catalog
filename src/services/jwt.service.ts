import jwt from 'jsonwebtoken';
import { NormalizedUser } from '../types/User';

function generateAccessToken(user: NormalizedUser) {
  return jwt.sign(user, process.env.JWT_KEY!, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

function validateAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY!);
  } catch (error) {
    return null;
  }
}

export const jwtService = {
  generateAccessToken,
  validateAccessToken,
};
