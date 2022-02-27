const codes = require('../utils/const');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codes.NOT_FOUND_ERROR_CODE;
  }
}

module.exports = NotFoundError;
