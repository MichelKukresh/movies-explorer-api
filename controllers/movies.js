const Movies = require('../models/movie');

const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorAuthorizedButForbidden = require('../errors/ErrorAuthorizedButForbidden');
const ErrorValidationAndCast = require('../errors/ErrorValidationAndCast');

module.exports.createMovie = (req, res, next) => {
  const
    {
      country, director, duration, year, description,
      image, trailerLink, thumbnail, nameRU, nameEN, movieId,
    } = req.body;
  const owner = req.user._id;
  Movies.create(
    {
      country,
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
  ).then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidationAndCast('Некорректные данные при создании карточки фильма .'));
      } else {
        next(err);
      }
    });
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
