import Keys from '../util/keys';
import nats from 'node-nats-streaming';
import { ListenerOrderExpired } from '../events/listeners/ListenerOrderExpired'
import { ListenerProductCreated } from '../events/listeners/ListenerProductCreated'
import { ListenerProductUpdated } from '../events/listeners/ListenerProductUpdated'

const client = nats.connect(
   Keys.NATS_CLUSTER_ID!, 
   Keys.NATS_CLIENT_ID!, 
   { url: Keys.NATS_URL });

client.on('connect', () => { 
   console.log('NATS connection successful.') 
   new ListenerOrderExpired(client).listen();
   new ListenerProductCreated(client).listen();
   new ListenerProductUpdated(client).listen();
});

client.on('error', err => console.log(`NATS connection error: ${err}`));

client.on('close', () => {
   console.log('Client closing...');
   process.exit();
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());

export { client };