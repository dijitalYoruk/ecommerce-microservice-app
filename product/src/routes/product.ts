// imports
import { Router } from 'express';
import { authenticated } from '@conqueror-ecommerce/common';
const routerProduct = Router();

// methods
import {
   createProduct,
   updateProduct,
   deleteProduct,
   retrieveProduct,
   retrieveProducts
} from '../controllers/product';

// validations
import {
   validateCreateProduct,
   validateUpdateProduct,
   validateDeleteProduct,
} from '../validations/product'

// routes
routerProduct.get('/', authenticated, retrieveProducts);
routerProduct.get('/:productId', authenticated, retrieveProduct);
routerProduct.put('/', authenticated, validateUpdateProduct, updateProduct);
routerProduct.post('/', authenticated, validateCreateProduct, createProduct);
routerProduct.delete('/', authenticated, validateDeleteProduct, deleteProduct);

export default routerProduct;