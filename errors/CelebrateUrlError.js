const validator = require('validator');

class CelebrateUrlError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports.validateUrl = (url) => {
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new CelebrateUrlError('Некоректный URL');
  }
  return url;
};
