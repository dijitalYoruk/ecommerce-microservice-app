import { NatsSubjects } from '../types/NatsSubjects';

export interface EventOrderExpired {
    subject: NatsSubjects.OrderExpired;
    data: { 
        order: string,
        version: number,
    };
}
