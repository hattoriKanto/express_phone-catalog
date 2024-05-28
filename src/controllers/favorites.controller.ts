import { Request, Response } from 'express';
import { prisma } from '..';
import { ApiError } from '../exceptions/api.error';
import { jwtService } from '../services/jwt.service';
import { JwtPayload } from 'jsonwebtoken';

export const addFavorite = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ addFavorite: 'Bad request' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  if (
    !id ||
    !productId ||
    typeof id !== 'number' ||
    typeof productId !== 'number'
  ) {
    return res.sendStatus(422);
  }

  const user = await prisma.user.findUnique({
    where: { id },
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
      userId: id,
      productId,
    },
  });

  res.status(200).json(newFavorite);
};

export const removeFavorite = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ addFavorite: 'Bad request' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  if (
    !id ||
    typeof id !== 'number' ||
    !productId ||
    typeof productId !== 'number'
  ) {
    return res.sendStatus(422);
  }

  const user = await prisma.user.findUnique({
    where: { id },
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

  await prisma.favorite.deleteMany({
    where: {
      userId: id,
      productId,
    },
  });

  res.sendStatus(204);
};

export const getFavoritesByUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ addFavorite: 'Bad request' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  if (!id || typeof id !== 'number') {
    return res.status(422).json({ error: 'Invalid user ID' });
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: id },
    include: { product: true },
  });

  res.status(200).json(favorites);
};
