import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api.error';

export const errorMiddleware = (
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError) {
    res
      .status(error.status)
      .send({ message: error.message, errors: error.errors });
  }
  if (error) {
    res.statusCode = 500;
    res.send({
      message: 'Server error',
    });
  }

  next();
};
