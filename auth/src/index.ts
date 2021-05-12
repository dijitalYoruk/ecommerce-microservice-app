import { app } from './app';
import keys from './util/keys';

// Mongo Config
import './services/Mongo';

// Exception Catcher
process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! 💥');
   console.log(err.name, err.message);
});

// Server Connection
app.listen(keys.SERVER_PORT, () => {
   console.log(`Server running on Port ${keys.SERVER_PORT}`);
});