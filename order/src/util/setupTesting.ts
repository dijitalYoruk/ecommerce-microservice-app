import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../services/NatsService', () => jest.requireActual('../__mocks__/NatsService'))

declare global {
   namespace NodeJS {
      interface Global {
         signin(): string;
         signinCustom(payload: { username: string, email: string, id: string}): string;
      }
   }
}

let mongo: any;

beforeAll(async () => {
   mongo = new MongoMemoryServer();
   const mongoUri = await mongo.getUri();
   await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   });
});

beforeEach(async () => {
   jest.clearAllMocks();
   const collections = await mongoose.connection.db.collections();
   for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
   await mongo.stop();
   await mongoose.connection.close();
});


global.signin = () => {
   // Build a JWT payload.  { id, email }
   const payload = {
      username: 'testUser',
      email: 'test@test.com',
      id: new mongoose.Types.ObjectId().toHexString(),
   };

   // Create the JWT!
   const token = jwt.sign(payload, process.env.JWT_SECRET!);
   return `Bearer ${token}`;
};


global.signinCustom = (payload: { username: string, email: string, id: string}) => {
   // Create the JWT!
   const token = jwt.sign(payload, process.env.JWT_SECRET!);
   return `Bearer ${token}`;
};