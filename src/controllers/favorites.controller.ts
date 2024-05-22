import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addFavorite = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  if (
    !userId ||
    !productId ||
    typeof userId !== 'number' ||
    typeof productId !== 'number'
  ) {
    return res.sendStatus(422);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newFavorite = await prisma.favorite.create({
    data: {
      userId,
      productId,
    },
  });

  res.status(200).json(newFavorite);
};

export const removeFavorite = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id || typeof id !== 'number') {
    return res.sendStatus(422);
  }

  await prisma.favorite.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
};

export const getFavoritesByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const normalizedUserId = parseInt(userId);

  if (!userId || typeof normalizedUserId !== 'number') {
    return res.status(422).json({ error: 'Invalid user ID' });
  }

  const user = await prisma.user.findUnique({
    where: { id: normalizedUserId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: normalizedUserId },
    include: { product: true },
  });

  res.status(200).json(favorites);
};
