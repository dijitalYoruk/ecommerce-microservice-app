// imports
import { Request, Response, Router } from 'express';
import { authenticated, BadRequestError, NotAuthorizedError } from '@conqueror-ecommerce/common';

// model
import { __ } from 'i18n';
import Order from '../../models/Order';

// methods

/**
 * Shows the order belonging to a customer.
 * @param req is the Request Object
 * @param res is the Response Object
 */
const showOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('products');
 
    if (!order) {
       throw new BadRequestError(__('error_not_found', __('Order')))
    }
 
    if (order.customer !== req.currentUserJWT?.id) {
       throw new NotAuthorizedError('Authorization Error');
    }
 
    res.status(200).json({
       status: 200,
       data: { order },
    });
 };


 // route
const router = Router();
router.get('/:orderId', authenticated, showOrder);
export default router;