const codes = require('../utils/const');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codes.UNAUTHORIZED_CODE;
  }
}

module.exports = UnauthorizedError;
