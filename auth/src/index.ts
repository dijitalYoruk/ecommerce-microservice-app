import { app } from './app';

// Mongo Config
import './services/mongo';

// Exception Catcher
process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! 💥');
   console.log(err.name, err.message);
});

// Server Connection
app.listen(3000, () => {
   console.log(`Server running on Port ${3000}`);
});