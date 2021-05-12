// imports
import { __ } from 'i18n';
import { Request, Response, Router } from 'express';
import { authenticated, NotAuthorizedError, NotFoundError } from '@conqueror-ecommerce/common';

// models
import Product from '../../models/Product';

// methods
const showProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
        throw new NotFoundError();
    }

    if (product.authorId !== req.currentUserJWT?.id) {
        throw new NotAuthorizedError(__('error_authorization'));
    }

    res.status(200).json({
        status: 200,
        data: { product },
    });
};

// route
const router = Router();
router.get('/:productId', authenticated, showProduct);
export default router;