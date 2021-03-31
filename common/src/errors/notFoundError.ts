import { __ } from 'i18n'
import CustomError from './customError'

export class NotFoundError extends CustomError {
   status = 404

   constructor() {
      super(__('error_not_found', __('route')))
      Object.setPrototypeOf(this, NotFoundError.prototype)
   }

   public serializeErrors() {
      return [this.message];
   }
}