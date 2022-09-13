const mongoose = require('mongoose');
const validator = require('validator'); // npm i validator
/// const { default: isURL } = require('validator/lib/isurl');

const moviesSchema = new mongoose.Schema({
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
    require: true,
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
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Invalid Url');
      }
    },
  },

  trailerLink: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Invalid Url');
      }
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Invalid Url');
      }
    },
  },

  owner: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: mongoose.Schema.Types.ObjectId, // тип ObjectId
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    // ref: 'User',
  },

  movieId: {
    // у пользователя есть имя — опишем требования к имени в схеме:
    type: Number, // тип ObjectId
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    // ref: 'User',
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },

});
module.exports = mongoose.model('Movies', moviesSchema);
