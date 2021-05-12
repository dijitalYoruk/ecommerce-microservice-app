// imports
import cors from 'cors';
import 'express-async-errors';
import i18n from './services/Localization';
import express, { json } from 'express';
import {NotFoundError, errorHandler} from '@conqueror-ecommerce/common';



const app = express();
app.use(cors());
app.use(json());
app.use(i18n.init);


// routes
import routesOrder from './routes/order';
app.use('/api/order', routesOrder);

app.all('*', () => {
   throw new NotFoundError();
});

app.use(errorHandler);
export { app }
