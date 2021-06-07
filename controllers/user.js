const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PageNotFoundError = require('../errors/PageNotFoundError');
const ValidationError = require('../errors/ValidateError');
const ConflictedError = require('../errors/ConflictedError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(200).send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError('Неверный формат переданных данных'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new ConflictedError('Пользователь с данным email уже зарегестрирован'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new ValidationError('Неверный формат переданных данных');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      return res.status(200).send({ token });
    })
    .catch(next);
};

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
