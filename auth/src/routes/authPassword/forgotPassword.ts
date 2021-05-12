// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import { generateToken } from '../../util/util';
import { Request, Response, Router } from 'express';
import { validateRequest, NotAuthorizedError, BadRequestError } from '@conqueror-ecommerce/common'

// models
import User from '../../models/User';

// request
interface RequestForgotPassword {
    usernameOrEmail: string
}

// validation
const validateForgotPassword = [
    body('usernameOrEmail')
        .notEmpty()
        .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),
    validateRequest
]

// method
const forgotPassword = async (req: Request, res: Response) => {
    const { usernameOrEmail } = req.body as RequestForgotPassword;

    // checking whether user exists in db.
    const user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
        throw new BadRequestError(__('error_not_found', __('user')));
    }

    if (!user.isVerified) {
        throw new NotAuthorizedError(__('error_not_verified'));
    }

    user.passwordResetToken = generateToken();
    user.passwordResetExpires = Date.now() + 1000 * 60 * 60 * 15;

    await user.save();
    await Email.sendForgotPasswordEmail(user.email, user.passwordResetToken);

    res.status(200).json({
        status: 200,
        data: { message: __('success_password_reset_email') },
    });
};

// route
const router = Router();
router.post('/forgotPassword', validateForgotPassword, forgotPassword);
export default router