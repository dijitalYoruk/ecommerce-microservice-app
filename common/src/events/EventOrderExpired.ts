import { NatsSubjects } from '../types/NatsSubjects';

export interface EventOrderExpired {
    version: number,
    subject: NatsSubjects.OrderExpired;
    data: { id: string };
}
