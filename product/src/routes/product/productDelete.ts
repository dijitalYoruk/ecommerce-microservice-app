// imports
import { __ } from 'i18n';
import { body } from 'express-validator';
import { Request, Response, Router } from 'express';
import PublisherProductDeleted from '../../events/publishers/PublisherProductDeleted';
import { authenticated, validateRequest, NotAuthorizedError, NotFoundError } from '@conqueror-ecommerce/common';

// models
import Product from '../../models/Product';

// method
const deleteProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
        throw new NotFoundError();
    }

    if (product.authorId !== req.currentUserJWT?.id) {
        throw new NotAuthorizedError(__('error_authorization'));
    }

    await product.remove();
    await PublisherProductDeleted.publish({ 
        product: product.id, 
        version: product.version 
    })

    res.status(200).json({
        status: 200,
        data: { message: 'Product Deleted successfully.' },
    });
};


// route
const router = Router();
router.delete('/:productId', authenticated, deleteProduct);
export default router;