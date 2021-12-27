const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');
const ConflictError = require('../middleware/errors/ConflictError');
const AuthenticationError = require('../middleware/errors/AuthenticationError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getAllUsers = ((req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
});

module.exports.getCurrentUser = ((req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('the user was not found');
      }
    })
    .catch(next);
});

module.exports.getUserById = ('/users/:id',
(req, res, next) => {
  User.findById(req.user._id)
    .select('name about avatar _id')
    .orFail(new Error('card ID not found'))
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundError('Id not found in the database');
      }
    })
    .catch(next);
});

module.exports.updateProfile = ((req, res, next) => {
  const opts = { runValidators: true, new: true };
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Cannot update the user');
      }
      next(err);
    })
    .catch(next);
});

module.exports.updateAvatar = (req, res, next) => {
  const opts = { runValidators: true, new: true };
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    opts,
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Cannot update the image');
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.statusCode === 'ValidationError') {
        throw new BadRequestError('The email and password are required');
      } else if (err.name === 'MongoServerError') {
        throw new ConflictError('User with this email already exist');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.send({ token });
      }
    }).catch((err) => {
      if (err) {
        throw new AuthenticationError('authorization failed');
      }
    })
    .catch(next);
};
