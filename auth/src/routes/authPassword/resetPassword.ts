// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import { validateRequest, NotAuthorizedError, BadRequestError } from '@conqueror-ecommerce/common'

// models
import User from '../../models/User';

// request
interface RequestResetPassword {
    token: string
    password: string
    passwordConfirm: string
}

// validation
const validateResetPassword = [
    body('token')
        .notEmpty()
        .withMessage(__('validation_request', __('token'))),

    body('password')
        .isLength({ min: 8 })
        .withMessage(__('validation_min_length', __('password'), '8')),

    body('passwordConfirm')
        .notEmpty()
        .withMessage('Password Confirmation is required.')
        .custom((value: string, { req }) => value === req.body.password)
        .withMessage('Passwords do not match.'),

    validateRequest
]


const resetPassword = async (req: Request, res: Response) => {
    const { password, passwordConfirm, token } = req.body as RequestResetPassword;
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
        throw new BadRequestError(__('error_not_found', __('user')));
    }

    const expireDate = user.passwordResetExpires!;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    // token is expired
    if (expireDate < Date.now()) {
        await user.save();
        throw new NotAuthorizedError(__('error_expired_token'));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    res.status(200).json({
        status: 200,
        data: { message: __('entity_updated', __('Password')) },
    });
};

// route
const router = Router();
router.post('/resetPassword', validateResetPassword, resetPassword);
export default router