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
   validateSignUp,
   validateSignIn,
   validateVerification,
   validateResendVerification,
   validateForgotPassword,
   validateResetPassword,
} from '../validations/auth';

// routes
routerAuth.post('/signUp', validateSignUp, signUp);
routerAuth.post('/signIn', validateSignIn, signIn);
routerAuth.post('/verify', validateVerification, verifyUser);
routerAuth.post('/resetPassword', validateResetPassword, resetPassword);
routerAuth.post('/forgotPassword', validateForgotPassword, forgotPassword);
routerAuth.post('/resendVerification', validateResendVerification, resendVerificationEmail);

export default routerAuth;
