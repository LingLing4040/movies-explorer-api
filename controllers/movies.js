const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const codes = require('../utils/const');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.status(codes.SUCCESS_CREATED_CODE).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(codes.SUCCESS_OK_CODE).send(movies))
  .catch(next);

module.exports.deleteMovie = (req, res, next) => {
  const currentUser = req.user._id;
  const movieId = req.params._id;

  return Movie.findById(movieId)
    .orFail(new NotFoundError(`Фильм с id ${movieId} не найден`))
    .then((movie) => {
      if (!movie.owner.equals(currentUser)) {
        throw new ForbiddenError('Вы не можете удалите фильм другого пользователя');
      }
      // return Movie.findByIdAndRemove(req.params._id).catch(next);
      return movie.remove().then(() => {
        res.status(codes.SUCCESS_OK_CODE).send({ data: movie });
      }).catch((err) => {
        next(err);
      });
    })
  // .then((movie) => {
  //   res.status(codes.SUCCESS_OK_CODE).send({ data: movie });
  // })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestError('Невалидный id'),
        );
      } else {
        next(err);
      }
    });
};
