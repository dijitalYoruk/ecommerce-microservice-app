// imports
import { Request, Response } from 'express';
import Order, { OrderDoc } from '../models/Order';
import Product, { ProductDoc } from '../models/Product';
import { BadRequestError, NotAuthorizedError, OrderStatus } from '@conqueror-ecommerce/common';
import PublisherOrderCreated from '../events/publishers/PublisherOrderCreated'
import PublisherOrderCancelled from '../events/publishers/PublisherOrderCancelled'

// model
import { __ } from 'i18n';

const EXPIRATION_WINDOW_MINUTES = 5;

// methods
export const createOrder = async (req: Request, res: Response) => {
   const { productIds } = req.body;
   const products = await Product.find({ _id: { $in: productIds }})

   if (products.length === 0) {
      throw new BadRequestError(__('error_not_found', __('Product')));
   }

   // Calculate an expiration date for this order
   const expiresAt = new Date();
   expiresAt.setMinutes(expiresAt.getMinutes() + EXPIRATION_WINDOW_MINUTES);

   const order = Order.build({
      products,
      expiresAt,
      customer: req.currentUserJWT!.id,
      status: OrderStatus.Created,
   });

   await order.save();
   await PublisherOrderCreated.publish({
      id: order.id,
      status: order.status,
      version: order.version,
      customerId: order.customer,
      expiresAt: expiresAt.toISOString(), 
      products: products.map(((product: ProductDoc) => { return { id: product.id, price: product.price } }))
   })

   res.status(200).json({
      status: 200,
      data: { message: __('success_registration') },
   });
};

export const deleteOrder = async (req: Request, res: Response) => {
   const { orderId } = req.params;
   const order = await Order.findById(orderId);

   if (!order) {
      throw new BadRequestError(__('error_not_found', __('Order')))
   }

   if (order.customer !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError('Authorization Error');
   }

   if (order.status === OrderStatus.Complete) {
      throw new BadRequestError(__('error_already_complete', __('Order')))
   }

   order.status = OrderStatus.Cancelled;
   await order.save();

   await PublisherOrderCancelled.publish({
      id: order.id,
      status: order.status,
      version: order.version,
      customerId: order.customer,
      expiresAt: order.expiresAt.toISOString(), 
      products: order.products.map(((product: ProductDoc) => { return { id: product.id, price: product.price } }))
   })

   res.status(200).json({
      status: 200,
      data: { order },
   });
};

export const retrieveOrder = async (req: Request, res: Response) => {
   const { orderId } = req.params;
   const order = await Order.findById(orderId).populate('products');

   if (!order) {
      throw new BadRequestError(__('error_not_found', __('Order')))
   }

   if (order.customer !== req.currentUserJWT?.id) {
      throw new NotAuthorizedError('Authorization Error');
   }

   res.status(200).json({
      status: 200,
      data: { order },
   });
};

export const retrieveOrders = async (req: Request, res: Response) => {
   const customer = req.currentUserJWT?.id;
   const orders = await Order.find({ customer }).populate('products');

   res.status(200).json({
      status: 200,
      data: { orders },
   });
};

export const retrieveOrdersAsAdmin = async (req: Request, res: Response) => {   
   let orderStatus: OrderStatus;
   const status = req.query.status as string;

   switch(status) {
      case OrderStatus.Created:
         orderStatus = OrderStatus.Created;
         break;
      case OrderStatus.Complete:
         orderStatus = OrderStatus.Complete;
         break;
      default:
         orderStatus = OrderStatus.AwaitingPayment;
   }


   const page = Number(req.query.page) || 1;
   const orders = await Order.paginate({ status: orderStatus }, { page, limit: 20, populate: 'products' });
   res.status(200).json({
      status: 200,
      data: { orders },
   });
};
