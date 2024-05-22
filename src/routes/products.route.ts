import express from 'express';
import * as productsController from '../controllers/products.controller';

export const router = express.Router();

router.get('/:category', productsController.getAll);
