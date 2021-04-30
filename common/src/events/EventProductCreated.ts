import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductCreated {
   subject: NatsSubjects.ProductCreated,
   data: {
      id: string,
      title: string,
      price: number,
      authorId: string,
      quantity?: number,
      description: string,
      isQuantityRestricted: boolean
   }
}