import { NextFunction, Request, Response } from 'express';

interface ControllerAction {
  (req: Request, res: Response, next?: NextFunction): Promise<void> | unknown;
}

export const catchError = (action: ControllerAction) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await action(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
