import JWT from '../util/jwt';
import { Request, Response, NextFunction } from 'express';
import NotAuthorizedError from '../errors/notAuthorizedError';
import { __ } from 'i18n';

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

export default async (req: Request, res: Response, next: NextFunction) => {
   // getting the jwt token
   const token = JWT.retrieveJWTtoken(req);

   // checking whether the token exists in the header
   if (!token) {
      throw new NotAuthorizedError(__('error_not_logged_in'));
   }

   // decoding the token
   const decodedTokenData = (await JWT.decode(token)) as UserPayload;

   // setting founded user as current user.
   req.currentUserJWT = decodedTokenData;
   next();
};
