const jwt = require('jsonwebtoken');
const UnauthoriError = require('../errors/UnauthorizError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthoriError('Для данного действия требуется авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-message-replace');
  } catch (err) {
    throw new UnauthoriError('Для данного действия требуется авторизация');
  }
  req.user = payload;
  next();
};
