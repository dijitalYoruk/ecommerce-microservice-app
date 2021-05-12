// imports
import FacebookAuth from '../../services/FacebookAuth';
import { Request, Response, Router } from 'express';

// method
let retrieveFacebookURL = async (req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        data: { facebookURL: FacebookAuth.getAuthURL() }
    })
}

// route
const router = Router();
router.get('/authURL', retrieveFacebookURL)
export default router