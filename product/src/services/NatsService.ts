import Keys from '../util/keys'
import nats, { Stan } from "node-nats-streaming";

export default class NatsService {
   private static _client?: Stan;

   public static get client() {
      return NatsService._client;
   }

   public static async connect() {
      NatsService._client = nats.connect(
         Keys.NATS_CLUSTER_ID!, 
         Keys.NATS_CLIENT_ID!, 
         { url: Keys.NATS_URL }
      );

      return new Promise((resolve, reject) => {
         NatsService._client?.on('error', err => reject(err));
         NatsService._client?.on('connect', () => resolve({}));         
      })
   }

   public static async setup() {
      await NatsService.connect();

      NatsService.client?.on('close', () => {
         console.log('Client closing...');
         process.exit();
      })

      process.on('SIGINT', () => NatsService.client?.close());
      process.on('SIGTERM', () => NatsService.client?.close());      
   }
}

NatsService.setup()
   .then(() => console.log('NATS connection successful.'))
   .catch(error => console.log(error))