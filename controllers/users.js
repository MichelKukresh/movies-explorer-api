require('dotenv').config();
const bcrypt = require('bcrypt'); // npm i bcrypt
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const User = require('../models/user');
const ErrorAuthorized = require('../errors/ErrorAuthorized');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorValidationAndCast = require('../errors/ErrorValidationAndCast');
const ErrorEmailConflict = require('../errors/ErrorEmailConflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => (User.create({
      name, email, password: hash,
    }))).then((u) => res.send({
      _id: u._id,
      name: u.name,
      email: u.email,
    })).catch((err) => {
      if (err.code === 11000) {
        next(new ErrorEmailConflict('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.infirmationAboutMe = (req, res, next) => {
  const { _id } = req.user;

  User.find({ _id })
    .orFail(new ErrorNotFound('Пользователь по указанному id не найден'))
    .then((u) => res.send({
      _id: u[0]._id,
      email: u[0].email,
      name: u[0].name,
    })).catch((err) => next(err));
};

module.exports.updateUsers = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { runValidators: true, new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidationAndCast('Переданы некорректные данные при изменении данных пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); // создадим токен
      res.send({ token }); // вернём токен
    }).catch((err) => {
      if (err.message === 'Authorized') {
        next(new ErrorAuthorized('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};
