import { __ } from 'i18n'
import CustomError from './customError'

export class EmailServiceError extends CustomError {
   status = 500

   constructor() {
      super(__('error_mail_not_send'))
      Object.setPrototypeOf(this, EmailServiceError.prototype)
   }

   public serializeErrors() {
      return [this.message]
   }
}