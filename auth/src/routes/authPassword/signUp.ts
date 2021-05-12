// imports
import { __ } from 'i18n';
import keys from '../../util/keys';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import { generateToken } from '../../util/util';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common'

// models
import User from '../../models/User';

// request
interface RequestSignUp {
    email: string,
    username: string,
    password: string,
    passwordConfirm: string
}

// validation
export const validateSignUp = [
    body('email')
        .isEmail()
        .withMessage(__('validation_request', __('email'))),

    body('username')
        .notEmpty()
        .withMessage(__('validation_request', __('password'))),

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

// method
const signUp = async (req: Request, res: Response) => {
    const body = req.body as RequestSignUp;
    const verificationToken = generateToken();

    const user = User.build({
        ...body,
        verificationToken,
        verificationExpires: Date.now() + 1000 * 60 * 60 * 15,
        authType: keys.AUTH_TYPE_PASSWORD,
    });

    await user.save();
    await Email.sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
        status: 200,
        data: { message: __('success_registration') },
    });
};

const router = Router();
router.post('/signUp', validateSignUp, signUp);
export default router