import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { catchError } from '../utils/catchError';

export const authRouter = Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.post('/login', catchError(authController.login));
authRouter.get('/users', authMiddleware, catchError(authController.users));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.post('/logout', catchError(authController.logout));
