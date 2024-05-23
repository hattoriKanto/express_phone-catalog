import { PrismaClient } from '@prisma/client';
import { Category, ErrorMessages, Product } from '../types';
import { ProductExpanded } from '../types/ProductCard';

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
    where: { ...filters, category: category },
    skip: perPage * (page - 1),
    take: perPage,
    orderBy,
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

  return result;
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
