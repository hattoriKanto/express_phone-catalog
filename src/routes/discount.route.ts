import express from 'express';
import * as discountController from '../controllers/discount.controller';

export const router = express.Router();

router.get('/', discountController.GetDiscount);
