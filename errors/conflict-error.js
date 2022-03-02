const codes = require('../utils/const');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = codes.CONFLICT_CODE;
  }
}

module.exports = ConflictError;
