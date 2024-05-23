import { Router } from 'express';
import { getAll, getNewestProducts } from '../controllers/products.controller';

const router = Router();

router.get('/new', getNewestProducts);
router.get('/:category', getAll);

export default router;
