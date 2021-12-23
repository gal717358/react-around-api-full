const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

const validateInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL),
    about: Joi.string().min(2).max(30),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateURL),
  }),
});

module.exports = {
  validateUser, validateInfo, validateCard, validateAvatar,
};
