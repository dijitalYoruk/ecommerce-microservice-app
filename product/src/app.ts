// imports
import cors from 'cors';
import 'express-async-errors';
import express, { json } from 'express';
import i18n from './services/localization'
import { NotFoundError, errorHandler } from '@conqueror-ecommerce/common';

const app = express();
app.use(cors());
app.use(json());
app.use(i18n.init);

// routes
import routesProduct from './routes/product';
app.use('/api/product', routesProduct);

app.all('*',  () => {
   throw new NotFoundError();
});

app.use(errorHandler);
export { app }
 