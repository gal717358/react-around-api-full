const mongoose = require('mongoose');
const validator = require('validator');

const cardsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator: (avatar) => validator.isUrl(avatar),
      message: 'The url you provided is not valid',
    },
  },
  owner: {
    type: Object,
    required: true,
  },
  likes: {
    type: Object,
    default: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardsSchema);
