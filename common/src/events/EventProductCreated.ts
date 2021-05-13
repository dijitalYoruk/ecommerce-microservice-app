import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductCreated {
   subject: NatsSubjects.ProductCreated,
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