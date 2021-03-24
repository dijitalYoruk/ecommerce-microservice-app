// config
import './services/mongo';

// imports
import 'express-async-errors';
import express, { json } from 'express';
import i18n from './services/localization'
import NotFoundError from './errors/notFoundError';
import errorHandler from './middleware/errorHandler';

const app = express();
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
   console.log("PASSES")
   throw new NotFoundError();
});

app.use(errorHandler);

// Exception catcher
process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! 💥');
   console.log(err.name, err.message);
});

// Server Connection
const server = app.listen(3000, () => {
   console.log(`Server running on Port ${3000}`);
});