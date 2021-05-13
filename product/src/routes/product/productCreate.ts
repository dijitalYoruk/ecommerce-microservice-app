
// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import { authenticated, validateRequest } from '@conqueror-ecommerce/common';
import PublisherProductCreated from '../../events/publishers/PublisherProductCreated';

// models
import Product from '../../models/Product';

// request
interface RequestCreateProduct {
    price: number,
    title: string,
    quantity?: number,
    description: string,
    placeholder: string,
    isQuantityRestricted: boolean
}

// validation
const validateCreateProduct = [

    body('title')
        .trim()
        .notEmpty()
        .withMessage(__('validation_request', __('Title'))),

    body('description')
        .trim()
        .isLength({ min: 50 })
        .withMessage(__('validation_min_length', __('description'), '50')),

    body('isQuantityRestricted')
        .isBoolean()
        .withMessage('Please specify whether the product is quantity restricted.'),

    body('quantity')
        .custom((quantity, { req }) => (req.body.isQuantityRestricted && quantity > 0) || !req.body.isQuantityRestricted)
        .withMessage('Please specify product quantity restricted.'),

    body('placeholder')
        .notEmpty()
        .withMessage(__('validation_request', __('placeholder'))),

    body('price')
        .isFloat({ gt: 0 })
        .withMessage(__('invalid', __('price'))),

    validateRequest
]

// method
const createProduct = async (req: Request, res: Response) => {
    const body = req.body as RequestCreateProduct;
    const product = Product.build({ ...body, authorId: req.currentUserJWT?.id! });
    await product.save();

    const { id, title, price, version, quantity, 
        placeholder, isQuantityRestricted, } = product;

    await PublisherProductCreated.publish({ 
        productId: id, version, title, placeholder, 
        price, isQuantityRestricted, quantity 
    })

    res.status(200).json({
        status: 200,
        data: { message: __('success_create', 'Product') },
    });
};

const router = Router();
router.post('/', authenticated, validateCreateProduct, createProduct);
export default router;