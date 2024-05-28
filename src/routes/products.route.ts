import { Router } from 'express';
import {
  getAll,
  getNewestProducts,
  getById,
  getRecommendedProducts,
  getByNamespaceId,
  getCategoryInfo,
} from '../controllers/products.controller';

const router = Router();

router.get('/new', getNewestProducts);
router.get('/:id/recommended', getRecommendedProducts);
router.get('/:category/:slug', getById);
router.get('/:category', getAll);
router.get('/:category/info', getCategoryInfo);
router.get('/', getByNamespaceId);

export default router;
