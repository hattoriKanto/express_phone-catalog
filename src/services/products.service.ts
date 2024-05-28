import { Category, BasicProduct, ErrorMessages } from '../types';
import { prisma } from '..';
import { Product } from '@prisma/client';

type GetAll = (
  category: string,
  pagParams: { perPage?: number | string; page?: number },
  filterParams: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
  },
  sortParams: { sortBy?: string },
) => Promise<BasicProduct[]>;

export const getAll: GetAll = async (
  category,
  pageParams,
  filterParams,
  sortParams,
) => {
  if (!Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  let pagePar = {};
  if (pageParams.perPage === 'All') {
    pagePar = {};
  } else {
    const perPage = pageParams.perPage || 4;
    const page = pageParams.page || 1;
    const skip = Number(perPage) * (page - 1);
    const take = perPage;
    pagePar = { skip: skip, take: take };
  }
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
    filters.price = {
      ...filters.price,
      gte: Number(minPrice),
    };
  }

  if (maxPrice) {
    filters.price = {
      ...filters.price,
      lte: Number(maxPrice),
    };
  }

  if (query) {
    const queryWords = query.split(' ').filter(word => word.trim() !== '');

    if (queryWords.length > 0) {
      filters.AND = queryWords.map(word => ({
        name: {
          contains: word,
          mode: 'insensitive',
        },
      }));
    }
  }

  const result = await prisma.product.findMany({
    where: { ...filters, category: category },
    ...pagePar,
    orderBy,
    select: {
      id: true,
      category: true,
      slug: true,
      name: true,
      fullPrice: true,
      price: true,
      screen: true,
      capacity: true,
      color: true,
      ram: true,
      images: true,
    },
  });

  return result;
};

export const getCategoryInfo = async (category: string) => {
  if (!Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }
  const result = await prisma.product.findMany({
    where: { category },
    orderBy: {
      price: 'desc',
    },
    select: {
      price: true,
    },
    take: 1,
  });
  return result;
};

export const getById = async (
  slug: string,
  category: string | null,
): Promise<Product> => {
  if (category && !Object.values(Category).find(cat => cat === category)) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  const result = await prisma.product.findUnique({
    where: category ? { slug, category } : { slug },
  });

  if (result === null) {
    throw new Error(ErrorMessages.NOT_FOUND);
  }

  return result;
};

export const getProductsByNamespaceId = async (namespaceId: string) => {
  const result = await prisma.product.findMany({
    where: { namespaceId },
  });

  return result;
};

export const getRecommendedProductsList = async (
  slug: string,
  color: string,
): Promise<BasicProduct[]> => {
  const result = await prisma.product.findMany({
    where: {
      color,
      slug: {
        not: slug,
      },
    },
    select: {
      id: true,
      category: true,
      slug: true,
      name: true,
      fullPrice: true,
      price: true,
      screen: true,
      capacity: true,
      color: true,
      ram: true,
      images: true,
    },
  });

  const sortedProducts = result.sort(
    (product1: BasicProduct, product2: BasicProduct) =>
      product1.price - product2.price,
  );

  return sortedProducts;
};

export const getNewestProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 20,
      select: {
        id: true,
        category: true,
        slug: true,
        name: true,
        fullPrice: true,
        price: true,
        screen: true,
        capacity: true,
        color: true,
        ram: true,
        images: true,
      },
    });

    return products;
  } catch (error) {
    throw new Error('Error fetching products');
  }
};
