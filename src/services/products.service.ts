import { PrismaClient } from '@prisma/client';
import {
  Category,
  ErrorMessages,
  ProductCard,
  ProductExpanded,
} from '../types';

type GetAll = (category: string) => Promise<ProductCard[]>;

const prisma = new PrismaClient();

export const getAll: GetAll = async category => {
  if (!Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  const result = await prisma.product.findMany({
    where: { category: `${category}` },
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
      year: true,
      images: true,
    },
  });
  const products = result.map(product => ({
    id: product.id,
    category: product.category,
    slug: product.slug,
    name: product.name,
    priceRegular: product.priceRegular,
    priceDiscount: product.priceDiscount,
    screen: product.screen,
    capacity: product.capacity,
    color: product.color,
    ram: product.ram,
    year: product.year,
    image: product.images[0],
  }));

  return products;
};

export const getById = async (id: number): Promise<ProductExpanded | null> => {
  const result = await prisma.product.findUnique({
    where: { id },
  });

  if (result === null) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  return result;
};
