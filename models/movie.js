const mongoose = require('mongoose');
const validator = require('validator');
const user = require('./user');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Страна должна быть указана'],
  },
  director: {
    type: String,
    required: [true, 'Режиссёр должен быть указан'],
  },
  duration: {
    type: Number,
    required: [true, 'Продолжительность должна быть указана'],
  },
  year: {
    type: String,
    required: [true, 'Дата выпуска должна быть указана'],
  },
  description: {
    type: String,
    required: [true, 'Описание должно быть указано'],
  },
  image: {
    type: String,
    required: [true, 'Поле "Image" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "Image" должно быть валидным url-адресом.',
    },
  },
  trailer: {
    type: String,
    required: [true, 'Поле "Trailder" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "Trailer" должно быть валидным url-адресом.',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "Thumbnail" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Поле "Thumbnail" должно быть валидным url-адресом.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: user,
  },
  movieId: {
    type: Number,
    ref: 'movie',
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Название на русском должно быть указано'],
  },
  nameEN: {
    type: String,
    required: [true, 'Название на английском должно быть указано'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
