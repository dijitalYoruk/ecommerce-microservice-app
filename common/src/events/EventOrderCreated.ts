import { NatsSubjects } from '../types/NatsSubjects';
import { OrderStatus } from '../types/OrderStatus';

export interface EventOrderCreated {
   subject: NatsSubjects.OrderCreated;
   data: {
      order: string;
      version: number;
      expiresAt: string;
      status: OrderStatus;
      products: {
         product: any;
         quantity: number,
         unitSellPrice: number;
      }[]
   };
}
