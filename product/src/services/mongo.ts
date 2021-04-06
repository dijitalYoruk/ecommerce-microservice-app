import Keys from '../util/keys';
import mongoose from 'mongoose';

// ============================
// SETUP SCHEMAS
// ============================
import '../models/product';

// ============================
// DATABASE CONNECTION
// ============================
mongoose
   .connect(Keys.MONGO_HOST!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('Mongo connection successful.');
   })
   .catch(error => {
      console.error(error);
   });
