
// imports
import { __ } from 'i18n';
import { Request, Response, Router } from 'express';
import PublisherOrderCancelled from '../../events/publishers/PublisherOrderCancelled';
import { authenticated, BadRequestError, NotAuthorizedError, OrderStatus } from '@conqueror-ecommerce/common';

// model
import Order from '../../models/Order';

// method

/**
 * Deletes the order and publishes event.
 * @param req is the Request Object
 * @param res is the Response Object
 */
const deleteOrder = async (req: Request, res: Response) => {
   const { orderId } = req.params;
   const order = await Order.findById(orderId);

   if (!order) {
      throw new BadRequestError(__('error_not_found', __('Order')))
   }

   if (order.customer !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError('Authorization Error');
   }

   if (order.status === OrderStatus.Completed) {
      throw new BadRequestError(__('error_already_complete', __('Order')))
   }

   order.status = OrderStatus.Cancelled;
   await order.save();

   const products = order.products.map(orderProduct => {
      return {
         id: orderProduct.product.id,
         quantity: orderProduct.quantity,
         unitSellPrice: orderProduct.unitSellPrice
      }
   })

   await PublisherOrderCancelled.publish({
      products,
      id: order.id,
      status: order.status,
      version: order.version,
      customerId: order.customer,
      expiresAt: order.expiresAt.toISOString(),
   })

   res.status(200).json({
      status: 200,
      data: { message: 'Sucessfully Deleted' },
   });
};


// route
const router = Router();
router.delete('/:orderId', authenticated, deleteOrder);
export default router;