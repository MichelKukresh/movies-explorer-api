const routesMovies = require('express').Router(); // создали роутер

const { createMovie, getMuSavedMovies, deleteMyMovie } = require('../controllers/movies');

routesMovies.get('/', getMuSavedMovies);
routesMovies.post('/', createMovie);
routesMovies.delete('/:id', deleteMyMovie);

module.exports = routesMovies;
