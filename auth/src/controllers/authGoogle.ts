// imports
import JWT from '../util/jwt';
import keys from '../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import Email from '../services/emailService';
import GoogleAuth from '../services/googleAuth';

// model
import User from '../models/user';

// methods

let retrieveGoogleURL = async (req: Request, res: Response) => {
   res.status(200).send({
      status: 200,
      data: { googleURL: GoogleAuth.getGoogleAuthURL() },
   });
};

let signInGoogle = async (req: Request, res: Response) => {
   const code = req.query.code as string;
   const dataGoogle = await GoogleAuth.getGoogleUser(code);
   let user = await User.findOne({ email: dataGoogle.email });

   if (!user) { // user not registered existence
      const { email, given_name } = dataGoogle;

      user = User.build({
         email, isVerified: true,
         authType: keys.AUTH_TYPE_GOOGLE,
         username: `${given_name}-${uuidv4()}`,
      });

      await user.save();
      await Email.sendRegistrationEmail(user.email)
   }

   const { _id: id, email, username } = user;
   const token = JWT.generate({ id, email, username });

   res.status(200).send({
      status: 200,
      data: { token, user },
   });
};

export { retrieveGoogleURL, signInGoogle };
