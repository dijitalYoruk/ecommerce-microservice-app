import { NatsSubjects } from '../types/NatsSubjects';
import { OrderStatus } from '../types/OrderStatus';

export interface EventOrderCancelled {
   subject: NatsSubjects.OrderCancelled;
   data: {
      order: string;
      version: number;
      status: OrderStatus;
      products: {
         product: any;
         quantity: number,
         unitSellPrice: number;
      }[]
   };
}
