// imports
import cors from 'cors';
import 'express-async-errors';
import express, { json } from 'express';
import i18n from './services/localization'
import {NotFoundError, errorHandler} from '@conqueror-ecommerce/common';

const app = express();
app.use(cors());
app.use(json());
app.use(i18n.init);

// routes
import routesAuthGoogle from './routes/authGoogle';
import routesAuthGithub from './routes/authGithub';
import routesAuthFacebook from './routes/authFacebook';
import routesAuthPassword from './routes/authPassword';

app.use('/api/auth/github', routesAuthGithub);
app.use('/api/auth/google', routesAuthGoogle);
app.use('/api/auth/facebook', routesAuthFacebook);
app.use('/api/auth', routesAuthPassword);

app.all('*', () => {
   throw new NotFoundError();
});

app.use(errorHandler);
export { app }
