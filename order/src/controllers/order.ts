// imports
import Keys from '../util/keys';
import { Request, Response } from 'express';
import { RequestCreateOrder } from '../requests/order';
import PublisherOrderCreated from '../events/publishers/PublisherOrderCreated';
import PublisherOrderCancelled from '../events/publishers/PublisherOrderCancelled';
import { BadRequestError, NotAuthorizedError, OrderStatus } from '@conqueror-ecommerce/common';

// model
import { __ } from 'i18n';
import Order from '../models/Order';
import Product from '../models/Product';

// methods

/**
 * Creates the order and publishes event.
 * @param req is the Request Object
 * @param res is the Response Object
 */
export const createOrder = async (req: Request, res: Response) => {
   const { productIds, productQuantities } = req.body as RequestCreateOrder;

   // fetch products
   let products = await Product.find({ _id: { $in: productIds }})
   if (productIds.length !== products.length) {
      throw new BadRequestError(__('error_not_found', __('Product')));
   }

   // Calculate an expiration date for this order
   const expiresAt = new Date();
   expiresAt.setMinutes(expiresAt.getMinutes() + Keys.EXPIRATION_WINDOW_MINUTES);

   // modify products for order 
   let orderProducts = []

   for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const quantity = productQuantities[i];
      const product = products.find(product => product.id === productId)!;
      orderProducts.push({ product, unitSellPrice: product!.price, quantity });
      // is quantity enough
      if (product.isQuantityRestricted && product.quantity < quantity) {
         throw new BadRequestError('Product is not available anymore.')
      }
   }

   // create the order
   const order = Order.build({
      expiresAt,
      products: orderProducts,
      customer: req.currentUserJWT!.id,
      status: OrderStatus.Created,
   });

   await order.save();

   // publish event
   orderProducts = orderProducts.map(orderProduct => {
      return { 
         id: orderProduct.product.id, 
         quantity: orderProduct.quantity, 
         unitSellPrice: orderProduct.unitSellPrice 
      } 
   }) 

   await PublisherOrderCreated.publish({
      id: order.id,
      status: order.status,
      version: order.version,
      products: orderProducts,
      customerId: order.customer,
      expiresAt: expiresAt.toISOString(), 
   })

   res.status(200).json({
      status: 200,
      data: { message: __('success_registration') },
   });
};

/**
 * Deletes the order and publishes event.
 * @param req is the Request Object
 * @param res is the Response Object
 */
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

   const products = order.products.map(orderProduct => {
      return { 
         id: orderProduct.product.id, 
         quantity: orderProduct.quantity, 
         unitSellPrice: orderProduct.unitSellPrice 
      } 
   }) 

   await PublisherOrderCancelled.publish({
      products,
      id: order.id,
      status: order.status,
      version: order.version,
      customerId: order.customer,
      expiresAt: order.expiresAt.toISOString(), 
   })

   res.status(200).json({
      status: 200,
      data: { message: 'Sucessfully Deleted' },
   });
};

/**
 * Retrieves the order belonging to a customer.
 * @param req is the Request Object
 * @param res is the Response Object
 */
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

/**
 * Retrieves the orders belonging to a customer.
 * @param req is the Request Object
 * @param res is the Response Object
 */
export const retrieveOrders = async (req: Request, res: Response) => {
   const customer = req.currentUserJWT?.id;
   const orders = await Order.find({ customer }).populate('products');

   res.status(200).json({
      status: 200,
      data: { orders },
   });
};

/**
 * Retrieves all the orders.
 * @param req is the Request Object
 * @param res is the Response Object
 */
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
   const orders = await Order.paginate(
      { status: orderStatus }, 
      { page, limit: 20, populate: 'products' }
   );

   res.status(200).json({
      status: 200,
      data: { orders },
   });
};
