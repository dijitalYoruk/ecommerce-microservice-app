import { NatsSubjects } from '../types/NatsSubjects'

export interface EventProductDeleted {
    subject: NatsSubjects.ProductDeleted,
    data: { 
        version: number,
        product: string ,
    }
}