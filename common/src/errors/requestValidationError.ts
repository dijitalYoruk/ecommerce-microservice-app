import { __ } from 'i18n';
import CustomError from './customError';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomError {
   status = 400;

   constructor(public errors: ValidationError[]) {
      super(__('error_invalid_params'));
      Object.setPrototypeOf(this, RequestValidationError.prototype);
   }

   public serializeErrors() {
      return this.errors.map(err => err.msg);
   }
}
