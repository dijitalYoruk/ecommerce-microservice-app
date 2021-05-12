// imports
import cors from 'cors';
import 'express-async-errors';
import express, { json } from 'express';
import i18n from './services/Localization'
import {NotFoundError, errorHandler} from '@conqueror-ecommerce/common';

const app = express();
app.use(cors());
app.use(json());
app.use(i18n.init);

// =========================================
// ORDINARY AUTH ROUTES
// =========================================
const PREFIX_URL_AUTH = '/api/auth'
import routeAuthSignIn from './routes/authPassword/signIn';
import routeAuthSignUp from './routes/authPassword/signUp';
import routeAuthVerifyUser from './routes/authPassword/verifyUser';
import routeAuthResetPassword from './routes/authPassword/resetPassword';
import routeAuthForgotPassword from './routes/authPassword/forgotPassword';
import routeAuthResendVerification from './routes/authPassword/resendVerification';
import routeAuthRetrieveCurrentUser from './routes/authPassword/retrieveCurrentUser';
app.use(PREFIX_URL_AUTH, routeAuthSignIn);
app.use(PREFIX_URL_AUTH, routeAuthSignUp);
app.use(PREFIX_URL_AUTH, routeAuthVerifyUser);
app.use(PREFIX_URL_AUTH, routeAuthResetPassword);
app.use(PREFIX_URL_AUTH, routeAuthForgotPassword);
app.use(PREFIX_URL_AUTH, routeAuthResendVerification);
app.use(PREFIX_URL_AUTH, routeAuthRetrieveCurrentUser);


// =========================================
// GOOGLE AUTH ROUTES
// =========================================
const PREFIX_URL_AUTH_GOOGLE = '/api/auth/google'
import routesAuthGoogleSignIn from './routes/authGoogle/signInViaGoogle';
import routesAuthGoogleRetrieveURL from './routes/authGoogle/retrieveGoogleURL'
app.use(PREFIX_URL_AUTH_GOOGLE, routesAuthGoogleSignIn);
app.use(PREFIX_URL_AUTH_GOOGLE, routesAuthGoogleRetrieveURL);


// =========================================
// GITHUB AUTH ROUTES
// =========================================
const PREFIX_URL_AUTH_GITHUB = '/api/auth/github'
import routesAuthGithubSignIn from './routes/authGithub/signInViaGitHub';
import routesAuthGithubRetrieveURL from './routes/authGithub/retrieveGitubURL'
app.use(PREFIX_URL_AUTH_GITHUB, routesAuthGithubSignIn);
app.use(PREFIX_URL_AUTH_GITHUB, routesAuthGithubRetrieveURL);

// =========================================
// FACEBOOK AUTH ROUTES
// =========================================
const PREFIX_URL_AUTH_FACEBOOK = '/api/auth/facebook'
import routesAuthFacebookSignIn from './routes/authFacebook/signInViaFacebook';
import routesAuthFacebookRetrieveURL from './routes/authFacebook/retrieveFacebookURL';
app.use(PREFIX_URL_AUTH_FACEBOOK, routesAuthFacebookSignIn);
app.use(PREFIX_URL_AUTH_FACEBOOK, routesAuthFacebookRetrieveURL);


app.all('*', () => { throw new NotFoundError(); });
app.use(errorHandler);
export { app }
