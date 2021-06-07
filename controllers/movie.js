const Movie = require('../models/movie');
const PageNotFoundError = require('../errors/PageNotFoundError');
const ForbidError = require('../errors/ForbidError');
const ValidateError = require('../errors/ValidateError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidateError('Неверный формат введенных данных'));
      } else {
        next('Произошла ошибка');
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new PageNotFoundError('Такой карточки нет в базе данных');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbidError('Недостаточно прав для удаления');
      } else {
        return movie.remove().then(() => res.status(200).send(movie)).cathc(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidateError('Неверный формат переданных данных'));
      } else {
        next(err);
      }
    });
};
