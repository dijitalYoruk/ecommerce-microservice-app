// imports
import { Router } from 'express'
const routerAuthFacebook = Router()

// methods
import { signInFacebook, retrieveFacebookURL } from '../controllers/authFacebook'

// validations
import { validateSignInFacebook } from '../validations/auth'

// routes
routerAuthFacebook.get('/authURL', retrieveFacebookURL)
routerAuthFacebook.get('/signIn', validateSignInFacebook, signInFacebook)
export default routerAuthFacebook