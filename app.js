const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routesMovies = require('./routes/movies');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');

const { PORT = 3001 } = process.env;

const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(cors());

app.use(express.json());

app.use(limiter);
app.use(helmet());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.use('/movies', routesMovies);

app.use('/users', routesUsers);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Неправильный путь'));
});

// централизованный обработчик ошибок
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
