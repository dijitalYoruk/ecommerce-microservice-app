import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import NotAuthorizedError from '../errors/notAuthorizedError';

interface UserPayload {
   id: string;
   email: string;
   username: string;
}

declare global {
   namespace Express {
      interface Request {
         currentUserJWT?: UserPayload;
      }
   }
}

const decode = (token: string) => {
   return jwt.verify(token, process.env.JWT_SECRET!);
}

const retrieveJWTtoken = (req: Request) => {
   let token: string | undefined = undefined;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
      token = req.headers.authorization.split(' ')[1]
   return token 
}

export default async (req: Request, res: Response, next: NextFunction) => {
   // getting the jwt token
   const token = retrieveJWTtoken(req);

   // checking whether the token exists in the header
   if (!token) {
      throw new NotAuthorizedError(__('error_not_logged_in'));
   }

   // decoding the token
   const decodedTokenData = decode(token) as UserPayload;

   // setting founded user as current user.
   req.currentUserJWT = decodedTokenData;
   next();
};
