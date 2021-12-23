const Card = require('../models/card');
const NotFoundError = require('../middleware/errors/notFoundError');

const handleCardErrors = (err) => {
  const errors = { name: '', link: '' };
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.getAllCards = ('/cards',
(req, res, next) => {
  Card.find(req.params.id)
    .select('name link owner likes createdAt _id')
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
});

module.exports.getCardByID = ('/cards/:id',
(req, res, next) => {
  Card.findById(req.params.id)
    .select('name link owner likes createdAt _id')
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Not Valid id' });
      }
    })
    .catch(next);
});

module.exports.createCard = ('/cards',
(req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner }).then((user) => res.send({ data: user }))
    .catch((err) => {
      const errors = handleCardErrors(err);
      if (errors) {
        res.status(400).send({ errors });
      }
    });
});

module.exports.deleteCardById = ('/cards/:id',
(req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('card ID not found'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'card ID not found') {
        throw new NotFoundError('Id not found in the database');
      } if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid Id' });
      }
    })
    .catch(next);
});

module.exports.likeCard = ('/cards/:cardId/likes',
(req, res, next) => {
  const opts = { runValidators: true, new: true };
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: [req.user._id] } }, opts)
    .orFail(new Error('card ID not found'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'card ID not found') {
        throw new NotFoundError('Id not found in the database');
      } if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid Id' });
      }
    })
    .catch(next);
});

module.exports.dislikeCard = ('/cards/:cardId/likes',
(req, res, next) => {
  const opts = { runValidators: true, new: true };
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: [req.user._id] } },
    opts,
  )
    .orFail(new Error('card ID not found'))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'card ID not found') {
        throw new NotFoundError('Id not found in the database');
      } if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid Id' });
      }
    })
    .catch(next);
});
