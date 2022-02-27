const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const urlPattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const movieSchema = new mongoose.Schema(
  {
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => urlPattern.test(v),
        message: 'Поле "image" должно быть валидным url-адресом.',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (v) => urlPattern.test(v),
        message: 'Поле "trailerLink" должно быть валидным url-адресом.',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v) => urlPattern.test(v),
        message: 'Поле "thumbnail" должно быть валидным url-адресом.',
      },
    },
    owner: {
      type: ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
