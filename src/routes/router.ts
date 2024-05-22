import express from 'express';
import { PrismaClient } from '@prisma/client';

export const router = express.Router();
const prisma = new PrismaClient();

// example for get all cart-items for 1 user by id
router.get('/user/:userId/cart-items', async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        product: true,
      },
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch cart items' });
  }
});
