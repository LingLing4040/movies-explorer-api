const codes = require('../utils/const');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || codes.INTERNAL_SERVER_ERROR_CODE;

  const message = statusCode === codes.INTERNAL_SERVER_ERROR_CODE
    ? 'На сервере произошла ошибка'
    : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
