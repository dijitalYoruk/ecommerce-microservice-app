// imports
import { Router } from 'express'
const routerAuthGithub = Router()

// methods
import { signInGithub, retrieveGithubURL } from '../controllers/authGithub'

// validations
import { validateSignInGithub } from '../validations/auth'

// routes
routerAuthGithub.get('/authURL', retrieveGithubURL)
routerAuthGithub.post('/signIn', validateSignInGithub, signInGithub)
export default routerAuthGithub