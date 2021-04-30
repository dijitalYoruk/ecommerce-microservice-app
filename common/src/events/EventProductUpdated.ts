import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductUpdated {
   subject: NatsSubjects.ProductUpdated,
   data: {
      id: string,
      title: string,
      price: number,
      quantity?: number,
      isQuantityRestricted: boolean
   }
}