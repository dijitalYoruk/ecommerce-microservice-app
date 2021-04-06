import { app } from './app';
import Keys from './util/keys';

// Mongo Config
import './services/mongo';
import './services/NatsService';

// Exception Catcher
process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! 💥');
   console.log(err.name, err.message);
});

// Server Connection
app.listen(Keys.SERVER_PORT, () => {
   console.log(`Server running on Port ${Keys.SERVER_PORT}`);
}); 