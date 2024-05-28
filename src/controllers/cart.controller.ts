import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const validateInput = async (
  userId: unknown,
  productId: unknown,
  res: Response,
) => {
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
};

export const addItemCart = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;

  await validateInput(userId, productId, res);
  const cartItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity: 1,
    },
  });
  res.status(200).json(cartItem);
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { userId: userIdReq, productId: productIdReq } = req.query;
  const userId = Number(userIdReq);
  const productId = Number(productIdReq);
  await validateInput(userId, productId, res);
  await prisma.cartItem.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });

  res.sendStatus(204);
};

export const changeQuantity = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;

  await validateInput(userId, productId, res);

  const updatedCartItem = await prisma.cartItem.update({
    where: {
      userId_productId: { userId, productId },
    },
    data: {
      quantity,
    },
  });
  res.json(updatedCartItem);
};

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const cart = await prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      product: true,
    },
  });
  res.json(cart);
};
