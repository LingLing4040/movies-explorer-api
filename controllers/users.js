const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const codes = require('../utils/const');
const ConflictError = require('../errors/conflict-error');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(codes.SUCCESS_CREATED_CODE).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else if (err.code === 11000) {
        next(
          new ConflictError('Такой email уже зарегистрирован'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getMe = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
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

module.exports.updateProfile = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  {
    name: req.body.name,
    email: req.body.email,
  },
  { new: true, runValidators: true },
)
  .orFail(new NotFoundError(`Пользователь с id ${req.user._id} не найден`))
  .then((user) => res.status(codes.SUCCESS_OK_CODE).send(user))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    } else if (err.code === 11000) {
      next(
        new ConflictError('Такой email уже зарегистрирован'),
      );
    } else {
      next(err);
    }
  });

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'jwtsecret');
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'none',
        // secure: true,
      }).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === codes.UNAUTHORIZED_CODE) {
        next(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res, next) => {
  try {
    res.clearCookie('token').send({ message: 'Вы вышли из профиля' });
  } catch (err) {
    next(err);
  }
};
