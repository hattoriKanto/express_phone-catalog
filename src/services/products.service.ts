import { PrismaClient } from '@prisma/client';
import { Category, ErrorMessages, Product } from '../types';

type GetAll = (
  category: string,
  pagParams: { perPage?: number; page?: number },
  filterParams: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
  },
  sortParams: { sortBy?: string },
) => Promise<Product[]>;

const prisma = new PrismaClient();

export const getAll: GetAll = async (
  category,
  pageParams,
  filterParams,
  sortParams,
) => {
  if (!Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const perPage = pageParams.perPage || 4;
  const page = pageParams.page || 1;
  const orderBy = {
    [sortParams.sortBy || 'name']: 'asc',
  };

  const { query, minPrice, maxPrice } = filterParams;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  filters.category = {
    equals: category,
  };

  if (minPrice) {
    filters.priceDiscount = {
      ...filters.priceDiscount,
      gte: Number(minPrice),
    };
  }

  if (maxPrice) {
    filters.priceDiscount = {
      ...filters.priceDiscount,
      lte: Number(maxPrice),
    };
  }

  if (query) {
    filters.name = {
      contains: query,
    };
  }

  const result = await prisma.product.findMany({
    skip: perPage * (page - 1),
    take: perPage,
    where: filters,
    orderBy,
  });

  return result;
};
