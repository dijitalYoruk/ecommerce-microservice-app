// imports
import { __ } from 'i18n';
import Keys from '../../util/keys';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import PublisherOrderCreated from '../../events/publishers/PublisherOrderCreated';
import { authenticated, validateRequest, OrderStatus, BadRequestError } from '@conqueror-ecommerce/common';

// models
import Order from '../../models/Order';
import Product from '../../models/Product';

// request
interface RequestCreateOrder {
    productIds: string[],
    productQuantities: number[]
}

// validations
const validateCreateOrder = [

    body('productIds')
        .notEmpty()
        .withMessage('Please provide productIds')
        .isArray({ min: 1 })
        .withMessage(__('validation_min_length', __('products'), '1')),

    body('productQuantities')
        .notEmpty()
        .withMessage('Please provide product quantities.')
        .isArray({ min: 1 })
        .withMessage(__('validation_min_length', 'Product quantities', '1'))
        .custom((quantities: number[], { req }) => quantities.length === req.body.productIds?.length)
        .withMessage('Please define quantitiy per product.')
        .custom((quantities: number[]) => quantities.every((quantity: number) => quantity > 0))
        .withMessage('Please define quantities greater than zero.'),

    validateRequest
]

// method

const createOrder = async (req: Request, res: Response) => {
    const { productIds, productQuantities } = req.body as RequestCreateOrder;

    // fetch products
    let products = await Product.find({ _id: { $in: productIds } })
    if (productIds.length !== products.length) {
        throw new BadRequestError(__('error_not_found', __('Product')));
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + Keys.EXPIRATION_WINDOW_MINUTES);

    // modify products for order 
    let orderProducts = []

    for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const quantity = productQuantities[i];
        const product = products.find(product => product.id === productId)!;
        orderProducts.push({ product: productId, unitSellPrice: product!.price, quantity });
        // is quantity enough
        if (product.isQuantityRestricted && product.quantity < quantity) {
            throw new BadRequestError('Product is not available anymore.')
        }
    }

    // create the order
    const order = Order.build({
        expiresAt,
        products: orderProducts,
        customer: req.currentUserJWT!.id,
        status: OrderStatus.Created,
    });

    await order.save();

    await PublisherOrderCreated.publish({
        order: order.id,
        status: order.status,
        version: order.version,
        products: order.products,
        expiresAt: order.expiresAt.toISOString(),
    })

    res.status(200).json({
        status: 200,
        data: { message: __('success_registration') },
    });
};

// route
const router = Router();
router.post('/', authenticated, validateCreateOrder, createOrder);
export default router;