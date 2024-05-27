import { Request, Response } from 'express';
import * as productsServices from '../services/products.service';
import { ErrorMessages, HTTPCodes } from '../types';

type Get = (req: Request, res: Response) => void;

export const getAll: Get = async (req, res) => {
  try {
    const { perPage, page, sortBy, query, minPrice, maxPrice } = req.query;
    const { category } = req.params;
    const filterParams: {
      query?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {};
    const pageParams: { perPage?: number; page?: number } = {};
    const sortParams: { sortBy?: string } = {};
    if (typeof Number(perPage) === 'number') {
      pageParams.perPage = Number(perPage);
    }
    if (typeof Number(page) === 'number') {
      pageParams.page = Number(page);
    }

    if (typeof sortBy === 'string') {
      sortParams.sortBy = sortBy;
    }

    if (typeof query === 'string') {
      filterParams.query = query;
    }
    if (typeof Number(minPrice) === 'number') {
      filterParams.minPrice = Number(minPrice);
    }
    if (typeof Number(maxPrice) === 'number') {
      filterParams.maxPrice = Number(maxPrice);
    }
    const products = await productsServices.getAll(
      category,
      pageParams,
      filterParams,
      sortParams,
    );
    res.status(HTTPCodes.OK).send(products);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ error: ErrorMessages.NOT_FOUND });
      }
    }

    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const getById: Get = async (req, res) => {
  try {
    const { slug, category } = req.params;
    const product = await productsServices.getById(slug, category);

    res.status(HTTPCodes.OK).send(product);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ error: ErrorMessages.NOT_FOUND });
      }
    }

    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const getByNamespaceId: Get = async (req, res) => {
  const { namespaceId } = req.query as {
    namespaceId: string;
  };

  const result = await productsServices.getProductsByNamespaceId(namespaceId);

  if (!result.length) {
    return res
      .status(HTTPCodes.NOT_FOUND)
      .json({ error: ErrorMessages.NOT_FOUND });
  }

  res.status(HTTPCodes.OK).send(result);
};

export const getNewestProducts = async (_: Request, res: Response) => {
  try {
    const products = await productsServices.getNewestProducts();

    res.status(HTTPCodes.OK).send(products);
  } catch (error) {
    res.status(HTTPCodes.NOT_FOUND).json({ error: 'list is empty' });
  }
};

export const getRecommendedProducts: Get = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productsServices.getById(slug, null);
    const { color } = product;
    const recommendedProductsList =
      await productsServices.getRecommendedProductsList(slug, color);

    res.status(HTTPCodes.OK).send(recommendedProductsList);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        return res
          .status(HTTPCodes.NOT_FOUND)
          .json({ error: ErrorMessages.NOT_FOUND });
      }
    }
    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};
