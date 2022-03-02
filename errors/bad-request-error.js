const codes = require('../utils/const');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codes.BAD_REQUEST_ERROR_CODE;
  }
}

module.exports = BadRequestError;
