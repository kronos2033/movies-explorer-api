// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const PageNotFoundError = require('../errors/PageNotFoundError');
const ValidationError = require('../errors/ValidateError');
const User = require('../models/user');

module.exports.aboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new PageNotFoundError('Такого пользователя не найдено');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true })
    .then((user) => {
      if (!user) {
        throw new PageNotFoundError('Такого пользователя нет в базе данных');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Неверный формат переданных данных'));
      } else {
        next(err);
      }
    });
};
