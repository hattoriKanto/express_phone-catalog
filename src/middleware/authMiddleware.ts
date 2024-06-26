/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IncomingHttpHeaders } from 'http';
import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../services/jwt.service';
import { ApiError } from '../exceptions/api.error';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw ApiError.unauthorized({ authMiddleware: 'Error in middleware' });
  }

  const [, accessToken] = authHeader.split(' ');

  if (!accessToken) {
    throw ApiError.unauthorized({ authMiddleware: 'Error in middleware' });
  }

  const userData = jwtService.validateAccessToken(accessToken);

  if (!userData) {
    ApiError.unauthorized({ authMiddleware: 'Error in middleware' });
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (
    userData &&
    typeof userData !== 'string' &&
    userData.exp &&
    userData.exp < currentTimestamp
  ) {
    throw ApiError.unauthorized({ authMiddleware: 'Token expired' });
  }

  next();
}
