// imports
import { __ } from 'i18n';
import JWT from '../../util/jwt';
import keys from '../../util/keys';
import { v4 as uuidv4 } from 'uuid';
import { body } from 'express-validator';
import Email from '../../services/EmailService';
import GithubAuth from '../../services/GithubAuth';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common';

// model
import User from '../../models/User' 

// request
interface RequestSignInViaGitHub {
    code: string
}

// validation
export const validateSignInGithub = [
    body('code')
        .notEmpty()
        .withMessage(__('validation_request', __('authentication_code'))),

    validateRequest
]

// method
let signInViaGithub = async (req: Request, res: Response) => {
    const { code } = req.body as RequestSignInViaGitHub
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

// route
const router = Router()
router.post('/signIn', validateSignInGithub, signInViaGithub)
export default router