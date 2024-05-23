import { PrismaClient } from '@prisma/client';
import { Category, ErrorMessages, Product } from '../types';

type GetAll = (category: string) => Promise<Product[]>;

const prisma = new PrismaClient();

export const getAll: GetAll = async category => {
  if (!Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  const result = await prisma.product.findMany({
    where: { category: category },
  });

  return result;
};
