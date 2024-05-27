import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { catchError } from '../utils/catchError';

export const authRouter = Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.post('/login', catchError(authController.login));
authRouter.get('/refresh', catchError(authController.refresh));
authRouter.post('/logout', catchError(authController.logout));
