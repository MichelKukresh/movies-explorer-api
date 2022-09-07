const express = require('express');
// Слушаем 3000 порт
const cors = require('cors'); // npm i cors
const mongoose = require('mongoose');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routesMovies = require('./routes/movies');
const routesUsers = require('./routes/users');
const { createUser, login } = require('./controllers/users');
/// const router = require('express').Router(); // создали роутер
const { PORT = 3000 } = process.env;
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(limiter);
app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', createUser);

app.post('/signin', login);

app.use(auth);

app.use('/movies', routesMovies); // запускаем

app.use('/users', routesUsers);

app.use(errorLogger); // подключаем логгер ошибок

app.use(cors());

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Неправильный путь'));
});

// централизованный обработчик ошибок
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${PORT}`);
});
