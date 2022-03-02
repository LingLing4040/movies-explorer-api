require('dotenv').config();
const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthorizedError('Требуется авторизация!');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'jwtsecret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(
        new UnauthorizedError('Требуется авторизация'),
      );
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
};
