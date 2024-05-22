import { Request, Response } from 'express';
import * as productsServices from '../services/products.service';
import { ErrorMessages, HTTPCodes } from '../types';

type GetAll = (req: Request, res: Response) => void;

export const getAll: GetAll = async (req, res) => {
  try {
    const { size, page } = req.query;
    const { category } = req.params;
    const params: { size?: number; page?: number } = {};
    if (typeof Number(size) === 'number') {
      params.size = Number(size);
    }
    if (typeof Number(page) === 'number') {
      params.page = Number(page);
    }
    const products = await productsServices.getAll(category, params);
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
