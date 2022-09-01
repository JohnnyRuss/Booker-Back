const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log({
    trigger: 'uncaughtException. proccess is exited !',
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

const PORT = process.env.PORT;
const DB = process.env.DB_APP_CONNECTION;

const mongoose = require('mongoose');
const App = require('./index');

const SERVER = App.listen(PORT, (con) => {
  console.log('app listens on port');
});

mongoose
  .connect(DB)
  .then(() => {
    console.log('db is connected');
    return SERVER();
  })
  .catch((err) =>
    process.on('unhandledRejection', (err) => {
      SERVER.close(() => process.exit(1));
    })
  );

// mongoose.connection.on('disconnected', () => {
//   console.log('DB Disconnected');
// });

// mongoose.connection.on('connected', () => {
//   console.log('DB Connected');
// });

process.on('unhandledRejection', (err) => {
  console.log(err);
  SERVER.close(() => process.exit(1));
});
