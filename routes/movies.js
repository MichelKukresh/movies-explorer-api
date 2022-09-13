const routesMovies = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { regexLink } = require('../util/utilConst');

const { createMovie, getMuSavedMovies, deleteMyMovie } = require('../controllers/movies');

routesMovies.get('/movies/', getMuSavedMovies);
routesMovies.post('/movies/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexLink),
    trailerLink: Joi.string().required().regex(regexLink),
    thumbnail: Joi.string().required().regex(regexLink),
    owner: Joi.required(),
    nameRU: Joi.required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

routesMovies.delete('/movies/:id', deleteMyMovie);

module.exports = routesMovies;
