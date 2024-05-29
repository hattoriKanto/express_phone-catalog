import express from 'express';
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { catchError } from '../utils/catchError';

export const router = express.Router();

router.post('/', authMiddleware, catchError(cartController.addItemCart));
router.get('/', authMiddleware, cartController.getCart);
router.delete('/', authMiddleware, cartController.deleteCartItem);
router.delete('/all', authMiddleware, cartController.deleteAll);
router.put('/', authMiddleware, cartController.changeQuantity);

export default router;
