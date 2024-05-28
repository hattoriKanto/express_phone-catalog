import { Router } from 'express';
// import { authMiddleware } from '../middleware/authMiddleware';
import { catchError } from '../utils/catchError';
import { authController } from '../controllers/auth.controller';

export const userRouter = Router();

userRouter.get('/users', /*authMiddleware, */ catchError(authController.users));
