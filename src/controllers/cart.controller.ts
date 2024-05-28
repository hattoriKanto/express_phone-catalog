import { Request, Response } from 'express';
import { prisma } from '..';
import { jwtService } from '../services/jwt.service';
import { ApiError } from '../exceptions/api.error';
import { JwtPayload } from 'jsonwebtoken';
import { HTTPCodes } from '../types';

const validateInput = async (id: number, productId: number, res: Response) => {
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
};

export const addItemCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ addFavorite: 'Bad request' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  await validateInput(id, productId, res);
  const cartItem = await prisma.cartItem.create({
    data: {
      userId: id,
      productId,
      quantity: 1,
    },
  });
  res.status(200).json(cartItem);
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { productId: productIdReq } = req.body;
  const productId = Number(productIdReq);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ getCart: 'Bad token' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;
  await validateInput(id, productId, res);
  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId: id,
        productId,
      },
    },
  });

  res.sendStatus(204);
};

export const deleteAll = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ getCart: 'Bad token' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  await prisma.cartItem.deleteMany({ where: { userId: id } });
  res.sendStatus(HTTPCodes.NO_CONTENT);
};

export const changeQuantity = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ getCart: 'Bad token' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  await validateInput(id, productId, res);
  const updatedCartItem = await prisma.cartItem.update({
    where: {
      userId_productId: { userId: id, productId },
    },
    data: {
      quantity,
    },
    include: { product: true },
  });
  res.json(updatedCartItem);
};

export const getCart = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return ApiError.unauthorized({ getCart: 'Bad token' });
  }

  const { id } = jwtService.validateAccessToken(token) as JwtPayload;

  const cart = await prisma.cartItem.findMany({
    where: {
      userId: id,
    },
    include: {
      product: true,
    },
    orderBy: {
      productId: 'asc',
    },
  });

  res.json(cart);
};
