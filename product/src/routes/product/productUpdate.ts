// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import { validateRequest } from '@conqueror-ecommerce/common';
import PublisherProductUpdated from '../../events/publishers/PublisherProductUpdated';

import { 
    authorize, 
    authenticated, 
    NotFoundError, 
    BadRequestError, 
    NotAuthorizedError,
    AuthorizationRoles, } from '@conqueror-ecommerce/common';

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

    body('isQuantityRestricted')
        .if(body('isQuantityRestricted').exists())
        .isBoolean()
        .withMessage('Please specify whether the product is quantity restricted.'),

    body('quantity')
        .if(body('quantity').exists())
        .custom((quantity, { req }) => (req.body.isQuantityRestricted && quantity > 0) || !req.body.isQuantityRestricted)
        .withMessage('Please specify product quantity restricted.'),

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

    const { id, title, price, version, quantity, 
        placeholder, isQuantityRestricted, } = product;

    await PublisherProductUpdated.publish({ 
        productId: id, version, title, placeholder, 
        price, isQuantityRestricted, quantity  
    })

    res.status(200).json({
        status: 200,
        data: { message: __('success_update', 'Product') },
    });
};

// route
const router = Router();

router.patch('/:productId', 
    authenticated, 
    authorize(AuthorizationRoles.Admin), 
    validateUpdateProduct, 
    updateProduct
);

export default router;