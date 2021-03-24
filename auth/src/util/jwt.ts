import jwt from 'jsonwebtoken';
import keys from '../util/keys';
import { promisify } from 'util';
import { Request } from 'express';

interface JwtCredentials {
   id: string;
   email: string;
   username: string;
}

export default class JWT {
   public static generate(credentials: JwtCredentials) {
      return jwt.sign(credentials, keys.JWT_SECRET!, { expiresIn: keys.JWT_EXPIRES_IN });
   }

   public static async decode(token: string) {
      return await promisify<string, string>(jwt.verify)(token, keys.JWT_SECRET!);
   }

   public static retrieveJWTtoken = (req: Request) => {
      let token: string | undefined = undefined;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
         token = req.headers.authorization.split(' ')[1]
      return token 
   }
}
