// imports
import { __ } from 'i18n';
import { Request, Response, Router } from 'express';
import { authenticated } from '@conqueror-ecommerce/common';

// models
import Product from '../../models/Product';

// methods
export const showAllProducts = async (req: Request, res: Response) => {
   const page = Number(req.query.page) || 1;
   const products = await Product.paginate({}, { page, limit: 20 });

   res.status(200).json({
      status: 200,
      data: { products },
   });
}; 

// route
const router = Router();
router.get('/', authenticated, showAllProducts);
export default router;