import crypto from 'crypto'
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import RequestValidationError from '../errors/requestValidationError';

const extractValidationErrors = async (req: Request, res: Response, next: NextFunction) => {  
   const validationErrors = validationResult(req).array();
   if (validationErrors.length) throw new RequestValidationError(validationErrors);
   next();
}
 
const generateToken = () => {
   const token = crypto.randomBytes(32).toString('hex')
   return crypto.createHash('sha256').update(token).digest('hex')
}

export {
   generateToken,
   extractValidationErrors
}