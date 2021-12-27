const Card = require('../models/card');
const NotFoundError = require('../middleware/errors/NotFoundError');
const BadRequestError = require('../middleware/errors/BadRequestError');
const ForbiddenError = require('../middleware/errors/ForbiddenError');

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
  Card.findById(req.user._id)
    .select('name link owner likes createdAt _id')
    .orFail(new NotFoundError('Id not found in the database'))
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        throw new NotFoundError('Id not found in the database');
      } if (err.statusCode === 400) {
        throw new BadRequestError('Invalid id');
      } else {
        next(err);
      }
    })
    .catch(next);
});

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      const errors = handleCardErrors(err);
      if (errors) {
        throw new BadRequestError({ errors });
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found in the database');
      }
      if (card.owner.toString() === req.user._id.toString()) {
        Card.deleteOne(card).then(() => res.send({ data: card }));
      } else {
        throw new ForbiddenError('You are not the owner of this card');
      }
    })
    .catch(next);
};

module.exports.likeCard = (
  (req, res, next) => {
    const opts = { runValidators: true, new: true };
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: [req.user._id] } },
      opts,
    )
      .orFail(new NotFoundError('non found card'))
      .then((card) => res.status(200).send({ data: card }))
      .catch((err) => {
        if (err.message === 'non found card') {
          throw new NotFoundError('Id not found in the database');
        }
        if (err.name === 'CastError') {
          res.status(400).send({ message: 'Invalid Id' });
        } else {
          next(err);
        }
      })
      .catch(next);
  });

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Could Not find the card');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Invalid card id');
      } else {
        next(err);
      }
    })
    .catch(next);
};
