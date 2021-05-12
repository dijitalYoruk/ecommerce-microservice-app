// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import { generateToken } from '../../util/util';
import { Request, Response, Router } from 'express';
import { validateRequest, BadRequestError } from '@conqueror-ecommerce/common'

// models
import User from '../../models/User';

// request
interface RequestResendVerification {
    email: string
}

// validation
const validateResendVerification = [
    body('email')
        .isEmail()
        .withMessage(__('validation_request', __('email'))),
    validateRequest
]

// method
const resendVerificationEmail = async (req: Request, res: Response) => {
    const { email } = req.body as RequestResendVerification;
    const user = await User.findOne({ email });

    if (!user) {
        throw new BadRequestError(__('error_not_found', __('user')));
    }

    if (user.isVerified) {
        throw new BadRequestError(__('error_user_already_verified'));
    }

    user.verificationToken = generateToken();
    user.verificationExpires = Date.now() + 1000 * 60 * 60 * 15;

    await user.save();
    await Email.sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).json({
        status: 200,
        data: { message: __('success_verification_resend') },
    });
};


// route
const router = Router();
router.post('/resendVerification', validateResendVerification, resendVerificationEmail);
export default router