import { Request, Response } from 'express';
import * as productsServices from '../services/products.service';
import { ErrorMessages, HTTPCodes } from '../types';

type GetAll = (req: Request, res: Response) => void;

export const getAll: GetAll = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productsServices.getAll(category);

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
