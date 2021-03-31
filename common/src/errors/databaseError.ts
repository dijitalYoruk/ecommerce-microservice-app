import CustomError from './customError';

export default class DatabaseError extends CustomError {
   status = 400;

   constructor(public errors: string[]) {
      super('Invalid Request Parameters');
      Object.setPrototypeOf(this, DatabaseError.prototype);
   }

   public serializeErrors() {
      return this.errors;
   }
}
