import { NatsSubjects } from './NatsSubjects'

export interface EventProductUpdated {
   subject: NatsSubjects.ProductUpdated,
   data: {
      id: string,
      title: string,
      price: string,
   }
}