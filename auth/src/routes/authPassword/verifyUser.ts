// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common'
import { NotAuthorizedError } from '@conqueror-ecommerce/common';

// models
import User from '../../models/User';

// request
interface RequestVerification {
   token: string
}

// validation
export const validateVerification = [
   body('token')
      .notEmpty()
      .withMessage(__('validation_request', __('token'))),
   validateRequest
]

// method
const verifyUser = async (req: Request, res: Response) => {
   const { token } = req.body as RequestVerification;
   const user = await User.findOne({ verificationToken: token });

   if (!user) {
      throw new NotAuthorizedError(__('error_invalid_token'));
   }

   const expireDate = user.verificationExpires!;
   user.verificationExpires = undefined;
   user.verificationToken = undefined;

   // verification token is expired
   if (expireDate < Date.now()) {
      await user.save();
      throw new NotAuthorizedError(__('error_expired_token'));
   }

   user.isVerified = true;
   await user.save();
   await Email.sendRegistrationEmail(user.email);

   res.status(200).send({
      status: 200,
      data: { message: __('success_user_verified') },
   });
};

// router
const router = Router();
router.post('/verify', validateVerification, verifyUser);
export default router