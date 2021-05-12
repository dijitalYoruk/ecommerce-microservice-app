// imports
import { Request, Response, Router } from 'express';
import { authenticated } from '@conqueror-ecommerce/common';

// models
import User from '../../models/User';

// method
const retrieveCurrentUser = async (req: Request, res: Response) => {
    const jwtData = req.currentUserJWT;
    const currentUser = await User.findById(jwtData?.id);

    res.status(200).send({
        status: 200,
        data: {
            user: currentUser,
        },
    });
};

// route
const router = Router();
router.get('/currentUser', authenticated, retrieveCurrentUser);
export default router