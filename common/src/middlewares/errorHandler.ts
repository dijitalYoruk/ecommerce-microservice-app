import { __ } from 'i18n';
import CustomError from '../errors/customError';
import {DatabaseError} from '../errors/databaseError';
import {BadRequestError} from '../errors/badRequestError';
import {NotAuthorizedError} from '../errors/notAuthorizedError';
import { Request, Response, NextFunction } from 'express';

const handleCastErrorDB = err => {
   const message = __('error_invalid', `${err.path}: ${err.value}`)
   return new DatabaseError([message])
}
 
const handleDuplicateFieldsDB = err => {
   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
   const message = __('error_already_in_use', value)
   return new DatabaseError([message])
}
 
const handleValidationErrorDB = err => {
   const messages = Object.values(err.errors).map((el: any) => el.message)
   return new DatabaseError(messages)
}

const handleJWTError = () => {
   const message = __('error_invalid_token')
   return new NotAuthorizedError(message)
}
 
const handleJWTExpiredError = () => {
   const message = __('error_expired_token')
   return new NotAuthorizedError(message)
}

const handleUnexpectedError = () => {
   const message = __('error_server_error')
   return new BadRequestError(message)
}

export default (err, req: Request, res: Response, next: NextFunction) => {

   if (err.name === 'CastError') { 
      err = handleCastErrorDB(err)
   } else if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err)
   } else if (err.name === 'ValidationError') { 
      err = handleValidationErrorDB(err)
   } else if (err.name === 'JsonWebTokenError') {
      err = handleJWTError()
   } else if (err.name === 'TokenExpiredError') {
      err = handleJWTExpiredError()
   } else if (!(err instanceof CustomError)) {
      err = handleUnexpectedError()
   }
   
   return res.status(err.status).send({ status: err.status, errors: err.serializeErrors() });
};