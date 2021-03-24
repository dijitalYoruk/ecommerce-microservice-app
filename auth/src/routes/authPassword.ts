// imports
import { Router } from 'express';
const routerAuth = Router();

// methods
import {
   signUp,
   signIn,
   verifyUser,
   resetPassword,
   forgotPassword,
   resendVerificationEmail 
} from '../controllers/authPassword';

// validations
import {
   validateSignUpJWT,
   validateSignInJWT,
   validateVerification,
   validateResendVerification,
   validateForgotPassword,
   validateResetPassword,
} from '../validations/auth';

// routes
routerAuth.post('/resetPassword', validateResetPassword, resetPassword);
routerAuth.post('/forgotPassword', validateForgotPassword, forgotPassword);
routerAuth.get('/verify', validateVerification, verifyUser);
routerAuth.post('/resendVerification', validateResendVerification, resendVerificationEmail);
routerAuth.post('/signUp', validateSignUpJWT, signUp);
routerAuth.post('/signIn', validateSignInJWT, signIn);
export default routerAuth;
