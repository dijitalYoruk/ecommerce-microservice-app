// imports
import { __ } from 'i18n';
import JWT from '../../util/jwt'
import keys from '../../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import { Request, Response, Router } from 'express';
import FacebookAuth from '../../services/FacebookAuth';
import { validateRequest } from '@conqueror-ecommerce/common';

// model
import User from '../../models/User'

// request
interface RequestSignInViaFacebook {
    code: string
}

// validation
export const validateSignInFacebook = [
    body('code')
        .notEmpty()
        .withMessage(__('validation_request', __('authentication_code'))),
    validateRequest
]

// methods
const signInViaFacebook = async (req: Request, res: Response) => {
    const { code } = req.body as RequestSignInViaFacebook
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

// route
const router = Router()
router.post('/signIn', validateSignInFacebook, signInViaFacebook)
export default router