// imports
import JWT from '../util/jwt'
import keys from '../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import Email from '../services/emailService';
import FacebookAuth from '../services/facebookAuth';

// model
import User from '../models/user' 

// methods

let retrieveFacebookURL = async (req: Request, res: Response) => {
   res.status(200).send({ 
      status: 200,
      data: { facebookURL: FacebookAuth.getAuthURL() }
   })
}

let signInFacebook = async (req: Request, res: Response) => {
   const code = req.query.code as string
   const accessToken = await FacebookAuth.getAccessToken(code)
   const dataFacebook = await FacebookAuth.getFacebookUserData(accessToken)
   let user = await User.findOne({ email: dataFacebook.email })
   
   if (!user) { // check user existence
      const { email, first_name } = dataFacebook 

      user = User.build({ 
         email, isVerified: true, 
         authType: keys.AUTH_TYPE_FACEBOOK,
         username: `${first_name}-${uuidv4()}`  
      });
      
      await user.save()
      await Email.sendRegistrationEmail(user.email)
   }

   const { _id: id, email, username } = user;
   const token = JWT.generate({ id, email, username })

   res.status(200).send({
      status: 200,
      data: { token, user } 
   })
}


// exporting methods
export { retrieveFacebookURL, signInFacebook };