import { PrismaClient } from '@prisma/client';
import { ErrorMessages, Product } from '../types';
const prisma = new PrismaClient();

type GetDiscount = () => Promise<Product[]>;

export const GetDiscount: GetDiscount = async () => {
  const result = await prisma.product.findMany({
    take: 20,
    select: {
      id: true,
      category: true,
      slug: true,
      name: true,
      priceRegular: true,
      priceDiscount: true,
      screen: true,
      capacity: true,
      color: true,
      ram: true,
      images: true,
    },
  });

  if (result.length === 0) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  return result
    .sort(
      (a, b) =>
        b.priceRegular - b.priceDiscount - (a.priceRegular - a.priceDiscount),
    )
    .sort((a, b) => b.category.localeCompare(a.category));
};
