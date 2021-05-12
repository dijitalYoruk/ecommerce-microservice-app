// imports
import { __ } from 'i18n';
import JWT from '../../util/jwt';
import { body } from 'express-validator';
import Password from '../../util/password';
import { Request, Response, Router } from 'express';
import { NotAuthorizedError, validateRequest } from '@conqueror-ecommerce/common';

// models
import User from '../../models/User';

// request
interface RequestSignIn {
    password: string,
    usernameOrEmail: string,
}

// validation
export const validateSignIn = [
    body('usernameOrEmail')
        .notEmpty()
        .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),

    body('password')
        .isLength({ min: 8 })
        .withMessage(__('validation_min_length', __('password'), '8')),

    validateRequest
]

// method
const signIn = async (req: Request, res: Response) => {
    // parsing body
    const body = req.body as RequestSignIn;

    // checking whether user exists in db.
    const user = await User.findOne({
        $or: [{ email: body.usernameOrEmail }, { username: body.usernameOrEmail }],
    });

    // check user existence
    if (!user) {
        throw new NotAuthorizedError(__('error_invalid_credentials'));
    }

    if (!user.isVerified) {
        throw new NotAuthorizedError(__('error_user_not_verified'));
    }

    if (!user.password) {
        throw new NotAuthorizedError(__('error_wrong_auth_type', user.authType, user.authType));
    }

    // checking whether the passwords match with each other.
    const isPasswordCorrect = await Password.compare(body.password, user.password!);

    if (!isPasswordCorrect) {
        throw new NotAuthorizedError(__('error_invalid_credentials'));
    }

    // generating corrsponding JWT token
    const { _id: id, email, username } = user;
    const token = JWT.generate({ id, email, username });

    res.status(200).json({
        status: 200,
        data: { token, user },
    });
};

// route
const router = Router();
router.post('/signIn', validateSignIn, signIn);
export default router