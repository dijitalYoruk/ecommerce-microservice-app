import { __ } from 'i18n';
import Product from '../models/product';
import { Request, Response } from 'express';
import PublisherProductCreated from '../publishers/PublisherProductCreated';
import PublisherProductUpdated from '../publishers/PublisherProductUpdated';
import PublisherProductDeleted from '../publishers/PublisherProductDeleted';
import { RequestCreateProduct, RequestUpdateProduct } from '../request/product';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@conqueror-ecommerce/common';

// methods


/**
 * Creates the product and publishes an event.
 * @param req is the Request Object. 
 * @param res is the Response Object
 */
export const createProduct = async (req: Request, res: Response) => {
   const body = req.body as RequestCreateProduct;
   const product = Product.build({ ...body, authorId: req.currentUserJWT?.id! });
   await product.save();

   const { id, title, price, isQuantityRestricted, quantity } = product;
   await PublisherProductCreated.publish({ id, title, price, isQuantityRestricted, quantity })

   res.status(200).json({
      status: 200,
      data: { message: __('success_create', 'Product') },
   });
}; 


/**
 * Updates the product and publishes an event.
 * @param req is the Request Object. 
 * @param res is the Response Object
 */
export const updateProduct = async (req: Request, res: Response) => {
   const body: RequestUpdateProduct = req.body;
   let product = await Product.findById(body.productId);

   if (!product) {
      throw new NotFoundError();
   }

   if (product.authorId !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError(__('error_authorization'));
   }

   if (body.isQuantityRestricted && body.quantity && body.quantity < 0 ) {
      throw new BadRequestError('Quantity cannot be lower than zero.')
   }

   body.productId = undefined;
   product.set(body)
   product = await product.save();

   const { id, title, price, isQuantityRestricted, quantity } = product;
   await PublisherProductUpdated.publish({ id, title, price, isQuantityRestricted, quantity })

   res.status(200).json({
      status: 200,
      data: { message: __('success_update', 'Product') },
   });
}; 


/**
 * Delets the product and publishes an event.
 * @param req is the Request Object. 
 * @param res is the Response Object
 */
export const deleteProduct = async (req: Request, res: Response) => {
   const { productId } = req.body;
   const product = await Product.findById(productId);

   if (!product) {
      throw new NotFoundError();
   }

   if (product.authorId !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError(__('error_authorization'));
   }

   await product.remove();
   await PublisherProductDeleted.publish({ id: product.id })

   res.status(200).json({
      status: 200,
      data: { message: 'Product Deleted successfully.' },
   });
}; 


/**
 * Retrieves the product.
 * @param req is the Request Object. 
 * @param res is the Response Object
 */
export const retrieveProduct = async (req: Request, res: Response) => {
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


/**
 * Retrieves all of the product.
 * @param req is the Request Object. 
 * @param res is the Response Object
 */
export const retrieveProducts = async (req: Request, res: Response) => {
   const page = Number(req.query.page) || 1;
   const products = await Product.paginate({}, { page, limit: 20 });

   res.status(200).json({
      status: 200,
      data: { products },
   });
}; 
