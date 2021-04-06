export default {
   MONGO_HOST: process.env.MONGO_HOST,
   SERVER_PORT: process.env.SERVER_PORT,
   JWT_SECRET: process.env.JWT_SECRET,
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
   NATS_URL: process.env.NATS_URL,
   NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
   NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
}