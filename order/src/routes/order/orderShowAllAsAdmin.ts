// imports
import { __ } from 'i18n';
import { Request, Response, Router } from 'express';

import {  
   authorize, 
   OrderStatus, 
   authenticated, 
   AuthorizationRoles 
} from '@conqueror-ecommerce/common';

// model
import Order from '../../models/Order';

// method

/**
 * Retrieves all the orders.
 * @param req is the Request Object
 * @param res is the Response Object
 */
export const showAllOrdersAsAdmin = async (req: Request, res: Response) => {   
   let orderStatus: OrderStatus;
   const status = req.query.status as string;

   switch(status) {
      case OrderStatus.Created:
         orderStatus = OrderStatus.Created;
         break;
      case OrderStatus.Completed:
         orderStatus = OrderStatus.Completed;
         break;
      default:
         orderStatus = OrderStatus.AwaitingPayment;
   }

   const page = Number(req.query.page) || 1;
   const orders = await Order.paginate(
      { status: orderStatus }, 
      { page, limit: 20, populate: 'products.product' }
   );

   res.status(200).json({
      status: 200,
      data: { orders },
   });
};

// route
const router = Router();

router.get('/asAdmin', 
   authenticated, 
   authorize(AuthorizationRoles.Admin), 
   showAllOrdersAsAdmin
);

export default router;