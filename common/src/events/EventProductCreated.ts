import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductCreated {
   subject: NatsSubjects.ProductCreated,
   data: {
      id: string,
      title: string,
      price: number,
      quantity?: number,
      placeholder:string;
      isQuantityRestricted: boolean
   }
}