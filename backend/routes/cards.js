const cardsRouter = require('express').Router();
const cardController = require('../controllers/cards');
const { validateCard } = require('../middleware/validations');

cardsRouter.get('/cards', cardController.getAllCards);
cardsRouter.get('/cards/:id', cardController.getCardByID);
cardsRouter.delete('/cards/:cardId', cardController.deleteCardById);
cardsRouter.post('/cards', validateCard, cardController.createCard);
cardsRouter.put('/cards/:cardId/likes', cardController.likeCard);
cardsRouter.delete('/cards/:cardId/likes', cardController.dislikeCard);

module.exports = cardsRouter;
