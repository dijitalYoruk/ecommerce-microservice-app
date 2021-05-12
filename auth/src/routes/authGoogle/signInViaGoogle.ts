// imports
import { __ } from 'i18n';
import JWT from '../../util/jwt';
import keys from '../../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import GoogleAuth from '../../services/GoogleAuth';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common'

// model
import User from '../../models/User'

// request
interface RequestSignInViaGoogle {
    code: string
}

// validation
export const validateSignInGoogle = [
    body('code')
        .notEmpty()
        .withMessage(__('validation_request', __('authentication_code'))),

    validateRequest
]

// method
const signInViaGoogle = async (req: Request, res: Response) => {
    const { code } = req.body as RequestSignInViaGoogle
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

// route
const router = Router()
router.post('/signIn', validateSignInGoogle, signInViaGoogle)
export default router