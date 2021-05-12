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


// =========================================
// ORDER ROUTES
// =========================================
const PREFIX_URL_ORDER = '/api/order'
import routeOrderShow from './routes/order/orderShow';
import routeOrderCreate from './routes/order/orderCreate';
import routeOrderDelete from './routes/order/orderDelete';
import routeOrderShowAll from './routes/order/orderShowAll';
import routeOrderShowAllAsAdmin from './routes/order/orderShowAllAsAdmin';

app.use(PREFIX_URL_ORDER, routeOrderShowAllAsAdmin);
app.use(PREFIX_URL_ORDER, routeOrderShowAll);
app.use(PREFIX_URL_ORDER, routeOrderCreate);
app.use(PREFIX_URL_ORDER, routeOrderDelete);
app.use(PREFIX_URL_ORDER, routeOrderShow);

app.all('*', () => {
   throw new NotFoundError();
});

app.use(errorHandler);
export { app }
