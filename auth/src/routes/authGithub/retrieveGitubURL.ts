// imports
import GithubAuth from '../../services/GithubAuth';
import { Request, Response, Router } from 'express';

// method
const retrieveGithubURL = async (req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        data: { githubURL: GithubAuth.getAuthURL() }
    })
}

// route
const router = Router();
router.get('/authURL', retrieveGithubURL)
export default router