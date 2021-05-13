import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductUpdated {
   subject: NatsSubjects.ProductUpdated,
   data: {
      title: string,
      price: number,
      version: number, 
      productId: string,
      quantity?: number,
      placeholder:string;
      isQuantityRestricted: boolean
   }
}