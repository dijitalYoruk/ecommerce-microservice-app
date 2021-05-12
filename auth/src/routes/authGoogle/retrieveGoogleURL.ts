// imports
import GoogleAuth from '../../services/GoogleAuth';
import { Request, Response, Router } from 'express';

// method
let retrieveGoogleURL = async (req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        data: { googleURL: GoogleAuth.getGoogleAuthURL() },
    });
};

// route
const router = Router();
router.get('/authURL', retrieveGoogleURL)
export default router