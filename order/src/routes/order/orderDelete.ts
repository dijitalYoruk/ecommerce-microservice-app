
// imports
import { __ } from 'i18n';
import { Request, Response, Router } from 'express';
import PublisherOrderCancelled from '../../events/publishers/PublisherOrderCancelled';
import { authenticated, BadRequestError, NotAuthorizedError, OrderStatus } from '@conqueror-ecommerce/common';

// model
import Order from '../../models/Order';

// method

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

   await PublisherOrderCancelled.publish({
      order: order.id,
      status: order.status,
      version: order.version,
      products: order.products,
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