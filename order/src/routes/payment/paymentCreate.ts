// imports
import { body } from 'express-validator';
import Payment from '../../models/Payment';
import stripe from '../../services/Stripe';
import { Request, Response, Router } from 'express';

import { 
    authorize, 
    OrderStatus,
    authenticated,
    validateRequest,
    BadRequestError, 
    NotAuthorizedError, 
    AuthorizationRoles } from '@conqueror-ecommerce/common';

// models
import Order from '../../models/Order';
import PublisherOrderCompleted from '../../events/publishers/PublisherOrderCompleted';

// request
interface RequestCreatePayment {
    token: string
    orderId: string
}

// validation
const validateCreatePayment = [
    body('token')
        .notEmpty()
        .withMessage('Token is missing.'),
    
    body('orderId')
        .notEmpty()
        .withMessage('Order is missing.'),

    validateRequest
]

// method
const createPayment = async (req: Request, res: Response) => {
    const { token, orderId } = req.body as RequestCreatePayment
    const order = await Order.findById(orderId)
    const customerId = req.currentUserJWT?.id

    if (!order) {
        throw new BadRequestError('Order not Found')
    }

    if (order.customer !== customerId) {
        throw new NotAuthorizedError('Authorization Error')
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Order cancelled.')
    }

    if (order.status === OrderStatus.Expired) {
        throw new BadRequestError('Order already expired.')
    }

    if (order.status === OrderStatus.Completed) {
        throw new BadRequestError('Order already completed.')
    }

    order.status = OrderStatus.Completed

    let paymentAmount = 0;
    for (const product of order.products) {
        paymentAmount += product.unitSellPrice
    }

    const response = await stripe.charges.create({
        amount: paymentAmount * 100,
        currency: 'gbp',
        source: token,
        description: `Ecommerce order: ${orderId}`,
    })

    const payment = Payment.build({
        stripeId: response.id,
        order: orderId,
        amount: paymentAmount,
    })

    await payment.save()
    order.payment = payment.id
    await order.save()

    await PublisherOrderCompleted.publish({
        order: order.id,
        version: order.version
    })

    res.status(200).send({
        status: 200,
        data: { message: 'Payment Successful' }
    })
}

// route
const router = Router();

router.post('/', 
    authenticated, 
    authorize(AuthorizationRoles.Customer), 
    validateCreatePayment, 
    createPayment
);

export default router;