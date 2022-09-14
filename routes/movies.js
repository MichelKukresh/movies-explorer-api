const routesMovies = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { regexLink } = require('../util/utilConst');

const { createMovie, getMuSavedMovies, deleteMyMovie } = require('../controllers/movies');

routesMovies.get('/movies/', getMuSavedMovies);
routesMovies.post('/movies/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regexLink),
    trailerLink: Joi.string().required().regex(regexLink),
    thumbnail: Joi.string().required().regex(regexLink),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);

routesMovies.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMyMovie);

module.exports = routesMovies;
