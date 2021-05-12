// imports
import { Request, Response, Router } from 'express';
import { authenticated } from '@conqueror-ecommerce/common';

// model
import { __ } from 'i18n';
import Order from '../../models/Order';

// method

/**
 * Retrieves the orders belonging to a customer.
 * @param req is the Request Object
 * @param res is the Response Object
 */
export const showAllOrders = async (req: Request, res: Response) => {
    const customer = req.currentUserJWT?.id;
    const orders = await Order.find({ customer }).populate('products');

    res.status(200).json({
        status: 200,
        data: { orders },
    });
};

// route
const router = Router();
router.get('/', authenticated, showAllOrders);
export default router;