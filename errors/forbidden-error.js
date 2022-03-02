const codes = require('../utils/const');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codes.FORBIDDEN_CODE;
  }
}

module.exports = ForbiddenError;
