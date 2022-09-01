const express = require('express');
const App = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const morgan = require('morgan');

const errorController = require('./utils/errorController');
const AppError = require('./utils/AppError');

const authenticationRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hotelRoutes = require('./routes/hotelsRoutes');
const roomRoutes = require('./routes/roomRoutes');

App.use(express.json());
App.use(cookieParser());
App.use(express.static(path.join(__dirname, 'public/assets')));
App.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://booker13.netlify.app'],
  })
);

App.use(morgan('dev'));

App.use('/api/v1/authentication', authenticationRoutes);
App.use('/api/v1/user', userRoutes);
App.use('/api/v1/hotels', hotelRoutes);
App.use('/api/v1/rooms', roomRoutes);
// App.use('/', (req, res, next) => {
//   res.status(200).json({ status: 'success', data: 'server' });
// });

App.all('*', (req, res, next) => {
  next(new AppError(404, `can't find ${req.originalUrl} on this server`));
});

App.use(errorController);

module.exports = App;
