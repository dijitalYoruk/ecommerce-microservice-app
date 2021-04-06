import { NatsSubjects } from '../types/NatsSubjects';
import { OrderStatus } from '../types/OrderStatus';

export interface EventOrderCreated {
   subject: NatsSubjects.OrderCancelled;
   data: {
      id: string;
      version: number;
      expiresAt: string;
      customerId: string;
      status: OrderStatus;
      products: [{
         id: string;
         price: number;
      }]
   };
}
