import { NatsSubjects } from '../types/NatsSubjects';
import { Stan, Message } from 'node-nats-streaming';

interface Event {
   subject: NatsSubjects;
   data: any;
}

export abstract class BaseListener<T extends Event> {
   // props
   private ackWait = 5 * 1000;
   public abstract subject: T['subject'];
   public abstract queueGroupName: string;
   public abstract onMessage(data: T['data'], msg: Message): void;

   // constructor
   constructor(protected client: Stan) {}

   // methods
   private get subscriptionOptions() {
      return this.client
         .subscriptionOptions()
         .setDeliverAllAvailable()
         .setManualAckMode(true)
         .setAckWait(this.ackWait)
         .setDurableName(this.queueGroupName);
   }

   private parseMessage(msg: Message) {
      const data = msg.getData();
      return typeof data === 'string'
        ? JSON.parse(data)
        : JSON.parse(data.toString('utf8'));
    }

   public listen() {
      const subscription = this.client.subscribe(
         this.subject, 
         this.queueGroupName, 
         this.subscriptionOptions
      );

      subscription.on('message', (message: Message) => {
         const parsedData = this.parseMessage(message)
         this.onMessage(parsedData, message);
      })
   }
}
