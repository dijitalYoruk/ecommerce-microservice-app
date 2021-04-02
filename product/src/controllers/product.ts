import { Request, Response } from 'express';
import { RequestCreateProduct, RequestUpdateProduct } from '../request/product'
import { NotAuthorizedError, NotFoundError } from '@conqueror-ecommerce/common';
import Product from '../models/product';

import { __ } from 'i18n';


export const createProduct = async (req: Request, res: Response) => {
   const body: RequestCreateProduct = req.body;
   const product = Product.build({ ...body, authorId: req.currentUserJWT?.id! });
   await product.save();

   res.status(200).json({
      status: 200,
      data: { message: __('success_create', 'Product') },
   });
}; 

export const updateProduct = async (req: Request, res: Response) => {
   const body: RequestUpdateProduct = req.body;
   const product = await Product.findById(body.productId);

   if (!product) {
      throw new NotFoundError();
   }

   if (product.authorId !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError(__('error_authorization'));
   }

   body.productId = undefined;
   product.set(body)
   await product.save();

   res.status(200).json({
      status: 200,
      data: { message: __('success_update', 'Product') },
   });
}; 

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

   res.status(200).json({
      status: 200,
      data: { message: __('success_update', 'Product') },
   });
}; 

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

export const retrieveProducts = async (req: Request, res: Response) => {
   const page = Number(req.query.page) || 1;
   const products = await Product.paginate({}, { page, limit: 20 });

   res.status(200).json({
      status: 200,
      data: { products },
   });
}; 
