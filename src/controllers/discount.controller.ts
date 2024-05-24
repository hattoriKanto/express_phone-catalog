import { Request, Response } from 'express';
import * as discountService from '../services/discount.service';
import { ErrorMessages, HTTPCodes } from '../types';

type GetDiscount = (req: Request, res: Response) => void;

export const GetDiscount: GetDiscount = async (req, res) => {
  try {
    const discounts = await discountService.GetDiscount();
    res.status(HTTPCodes.OK).send(discounts);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === ErrorMessages.NOT_FOUND) {
        return (res.statusCode = HTTPCodes.NOT_FOUND);
      }
    }

    res.statusCode = HTTPCodes.INTERNAL_SERVER_ERROR;
  }
};
