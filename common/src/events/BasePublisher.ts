import { NatsSubjects } from './NatsSubjects';
import { Stan } from 'node-nats-streaming';

interface Event {
   subject: NatsSubjects;
   data: any;
}

export abstract class BasePublisher<T extends Event> {
   // props
   public abstract subject: T['subject'];

   // constructor
   constructor(protected client: Stan) {}

   // methods
   public publish(data: T['data']) {
      return new Promise((resolve, reject) => {
         const messageData = JSON.stringify(data);
         this.client.publish(this.subject, messageData, error => {
            if (error) reject(error);
            else { 
               resolve({});
            }
            });
      });
   }
}
