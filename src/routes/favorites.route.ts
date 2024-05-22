import { Router } from 'express';

import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from '../controllers/favorites.controller';

const router = Router();

router.post('/', addFavorite);
router.delete('/', removeFavorite);
router.get('/:userId', getFavoritesByUser);

export default router;
