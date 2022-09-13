const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routesMovies = require('./routes/movies');
const routesUsers = require('./routes/users');

const {
  PORT = 3001,
  dataMovies = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const routesSign = require('./routes/sign');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
});

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(requestLogger);
app.use(limiter); // важно подключить после логера

app.use(routesSign);

app.use(auth);

app.use(routesMovies);

app.use(routesUsers);
app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Неправильный путь'));
});
app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`);
});
