// imports
import cors from 'cors';
import 'express-async-errors';
import express, { json } from 'express';
import i18n from './services/Localization'
import { NotFoundError, errorHandler } from '@conqueror-ecommerce/common';

const app = express();
app.use(cors());
app.use(json());
app.use(i18n.init);

// =========================================
// ORDER ROUTES
// =========================================
const PREFIX_URL_PRODUCT = '/api/product'
import routeProductShow from './routes/product/productShow';
import routeProductCreate from './routes/product/productCreate';
import routeProductUpdate from './routes/product/productUpdate';
import routeProductDelete from './routes/product/productDelete';
import routeProductShowAll from './routes/product/productShowAll';

app.use(PREFIX_URL_PRODUCT, routeProductShow);
app.use(PREFIX_URL_PRODUCT, routeProductUpdate);
app.use(PREFIX_URL_PRODUCT, routeProductCreate);
app.use(PREFIX_URL_PRODUCT, routeProductDelete);
app.use(PREFIX_URL_PRODUCT, routeProductShowAll);

app.all('*',  () => {
   throw new NotFoundError();
});

app.use(errorHandler);
export { app }
 