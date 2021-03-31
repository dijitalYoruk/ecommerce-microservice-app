import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {RequestValidationError} from '../errors/requestValidationError';

export default async (req: Request, res: Response, next: NextFunction) => {  
   const validationErrors = validationResult(req).array();
   if (validationErrors.length) throw new RequestValidationError(validationErrors);
   next();
}