const routesSign = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');

routesSign.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

routesSign.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = routesSign;
