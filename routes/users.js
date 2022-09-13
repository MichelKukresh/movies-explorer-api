const routesUsers = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');

const { updateUsers } = require('../controllers/users');
const { infirmationAboutMe } = require('../controllers/users');

routesUsers.get('/users/me', infirmationAboutMe);
routesUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUsers);

module.exports = routesUsers;
