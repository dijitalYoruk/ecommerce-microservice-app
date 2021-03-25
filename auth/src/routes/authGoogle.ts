// imports
import { Router } from 'express'
const routerAuthGoogle = Router()

// methods
import { signInGoogle, retrieveGoogleURL } from '../controllers/authGoogle'

// validations
import { validateSignInGoogle } from '../validations/auth'

// routes
routerAuthGoogle.get('/authURL', retrieveGoogleURL)
routerAuthGoogle.post('/signIn', validateSignInGoogle, signInGoogle)
export default routerAuthGoogle