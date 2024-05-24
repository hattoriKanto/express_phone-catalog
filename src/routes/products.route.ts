import { Router } from 'express';
import {
  getAll,
  getNewestProducts,
  GetById,
  getRecommendedProducts,
} from '../controllers/products.controller';

const router = Router();

router.get('/new', getNewestProducts);
router.get('/:id/recommended', getRecommendedProducts);
router.get('/:category/:id', GetById);
router.get('/:category', getAll);

export default router;
