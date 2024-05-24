import { PrismaClient, Product } from '@prisma/client';
import { ErrorMessages } from '../types';
const prisma = new PrismaClient();

type GetDiscount = () => Promise<Product[]>;

export const GetDiscount: GetDiscount = async () => {
  const result: Product[] =
    await prisma.$queryRaw`SELECT "id", "category", "slug", "name", "priceRegular", "priceDiscount", "screen", "capacity", "color", "ram", "images"
  FROM "Product"
  ORDER BY "priceRegular" - "priceDiscount" DESC
  LIMIT 20;`;

  if (result.length === 0) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  return result.sort((a, b) => b.category.localeCompare(a.category));
};
