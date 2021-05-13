import { NatsSubjects } from '../types/NatsSubjects';

export interface EventOrderCompleted {
    version: number,
    subject: NatsSubjects.OrderCompleted;
    data: { 
        order: string,
        version: number
    };
}