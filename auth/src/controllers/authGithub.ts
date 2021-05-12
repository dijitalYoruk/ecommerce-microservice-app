// imports
import JWT from '../util/jwt';
import keys from '../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import Email from '../services/EmailService';
import GithubAuth from '../services/GithubAuth';

// model
import User from '../models/User' 

// methods

let retrieveGithubURL = async (req: Request, res: Response) => {
   res.status(200).send({ 
      status: 200,
      data: { githubURL: GithubAuth.getAuthURL() }
   })
}

let signInGithub = async (req: Request, res: Response) => {
   const code = req.body.code
   const accessToken = await GithubAuth.getAccessToken(code)
   const dataGithub = await GithubAuth.getUserData(accessToken)
   let user = await User.findOne({ email: dataGithub.email })
   
   if (!user) { // check user existence
      const { email, login } = dataGithub

      user = User.build({ 
         email, isVerified: true, 
         authType: keys.AUTH_TYPE_GITHUB,
         username: `${login}-${uuidv4()}`,  
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

export { retrieveGithubURL, signInGithub };