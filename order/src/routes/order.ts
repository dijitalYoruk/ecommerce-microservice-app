// imports
import { Router } from 'express';
import { authenticated } from '@conqueror-ecommerce/common';
const routerOrder = Router();

// methods
import { 
   createOrder, 
   deleteOrder, 
   retrieveOrder, 
   retrieveOrders, 
   retrieveOrdersAsAdmin } from '../controllers/order';

// validations
import {
   validateCreateOrder,
} from '../validations/order'

// routes
routerOrder.get('/', authenticated, retrieveOrders);
routerOrder.delete('/:orderId', authenticated, deleteOrder);
routerOrder.get('/:orderId', authenticated, retrieveOrder);
routerOrder.get('/asAdmin', authenticated, retrieveOrdersAsAdmin);
routerOrder.post('/', authenticated, validateCreateOrder, createOrder);

export default routerOrder;