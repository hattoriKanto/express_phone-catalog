import { Router } from 'express';

import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from '../controllers/favorites.controller';

const router = Router();

router.post('/favorites', addFavorite);
router.delete('/favorites', removeFavorite);
router.get('/:userId/favorites', getFavoritesByUser);

export default router;
