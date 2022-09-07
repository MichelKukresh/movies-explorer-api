const Movies = require('../models/movie');

const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorAuthorizedButForbidden = require('../errors/ErrorAuthorizedButForbidden');

module.exports.createMovie = (req, res, next) => {
  const
    {
      countru, director, duration, year, description,
      image, trailerLink, thumbnail, nameRU, nameEN, movieId,
    } = req.body;
  const owner = { _id: req.user._id };
  Movies.create(
    {
      countru,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      nameRU,
      nameEN,
      movieId,
    },
  ).then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.getMuSavedMovies = (req, res, next) => {
  const owner = { _id: req.user._id };
  Movies.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

// удаление фильма
module.exports.deleteMyMovie = (req, res, next) => {
  // определение создаткля карточки
  Movies.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound('Передан несуществующий _id фильма.');
      }

      if (movie.owner.toHexString() !== req.user._id) {
        throw new ErrorAuthorizedButForbidden('Удаление фильма чужого пользователя запрещено.');
      }
    })
    .then(() => {
      Movies.findByIdAndRemove(req.params.id)
        .orFail(new ErrorNotFound('Передан несуществующий _id фильма.'))
        .then((movie) => res.send({ data: movie }));
    })
    .catch((err) => next(err));
};
