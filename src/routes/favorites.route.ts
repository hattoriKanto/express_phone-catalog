import { Router } from 'express';

import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
} from '../controllers/favorites.controller';
// import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/favorites', /*authMiddleware, */ addFavorite);
router.delete('/favorites', /*authMiddleware,*/ removeFavorite);
router.get('/:userId/favorites', /*authMiddleware,*/ getFavoritesByUser);

export default router;
