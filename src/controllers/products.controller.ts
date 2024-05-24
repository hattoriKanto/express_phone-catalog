import { Request, Response } from 'express';
import * as productsServices from '../services/products.service';
import { ErrorMessages, HTTPCodes } from '../types';

type GetAll = (req: Request, res: Response) => void;

export const getAll: GetAll = async (req, res) => {
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
        return (res.statusCode = HTTPCodes.NOT_FOUND);
      }
    }

    res.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
  }
};

type GetById = (req: Request, res: Response) => void;

export const GetById: GetById = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await productsServices.getById(+id);

    res.status(HTTPCodes.OK).send(products);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        res.status(HTTPCodes.NOT_FOUND).send(ErrorMessages.NOT_FOUND);
        return;
      }
    }

    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .send(ErrorMessages.INTERNAL_SERVER_ERROR);
  }
};

export const getNewestProducts = async (_: Request, res: Response) => {
  try {
    const products = await productsServices.getNewestProducts();

    res.status(200).send(products);
  } catch (error) {
    res.status(404).json({ error: 'list is empty' });
  }
};

type getRecommendedProducts = (req: Request, res: Response) => void;

export const getRecommendedProducts: getRecommendedProducts = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const product = await productsServices.getById(+id);
    const { color } = product;
    const recommendedProductsList =
      await productsServices.getRecommendedProductsList(Number(id), color);

    res.status(HTTPCodes.OK).send(recommendedProductsList);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        res.status(HTTPCodes.NOT_FOUND).send(ErrorMessages.NOT_FOUND);
        return;
      }
    }
    res
      .status(HTTPCodes.INTERNAL_SERVER_ERROR)
      .send(ErrorMessages.INTERNAL_SERVER_ERROR);
  }
};
