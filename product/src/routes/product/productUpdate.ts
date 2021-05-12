// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common';
import PublisherProductUpdated from '../../events/publishers/PublisherProductUpdated';
import { authenticated, BadRequestError, NotAuthorizedError, NotFoundError } from '@conqueror-ecommerce/common';

// models
import Product from '../../models/Product';

// request
interface RequestUpdateProduct {
    price?: number,
    title?: string,
    quantity?: number,
    description?: string,
    placeholder?: string,
    isQuantityRestricted: boolean
}

// validation
const validateUpdateProduct = [

    body('title')
        .if(body('title').exists())
        .notEmpty()
        .withMessage(__('validation_request', __('Title'))),

    body('placeholder')
        .if(body('placeholder').exists())
        .notEmpty()
        .withMessage(__('validation_request', __('placeholder'))),

    body('description')
        .if(body('description').exists())
        .trim()
        .isLength({ min: 50 })
        .withMessage(__('validation_min_length', __('description'), '50')),

    body('price')
        .if(body('price').exists())
        .isFloat({ gt: 0 })
        .withMessage(__('invalid', __('price'))),

    validateRequest
]

// method
const updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.params
    const body = req.body as RequestUpdateProduct;
    let product = await Product.findById(productId);

    if (!product) {
        throw new NotFoundError();
    }

    if (product.authorId !== req.currentUserJWT?.id) {
        throw new NotAuthorizedError(__('error_authorization'));
    }

    if (body.isQuantityRestricted && body.quantity && body.quantity < 0) {
        throw new BadRequestError('Quantity cannot be lower than zero.')
    }

    product.set(body)
    product = await product.save();

    const { id, title, placeholder, price, isQuantityRestricted, quantity, version } = product;
    await PublisherProductUpdated.publish({ id, title, placeholder, price, isQuantityRestricted, quantity, version })

    res.status(200).json({
        status: 200,
        data: { message: __('success_update', 'Product') },
    });
};

// route
const router = Router();
router.patch('/:productId', authenticated, validateUpdateProduct, updateProduct);
export default router;