const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const { validateInfo, validateAvatar } = require('../middleware/validations');

usersRouter.get('/users', userController.getAllUsers);
usersRouter.get('/users/me', userController.getCurrentUser);
usersRouter.get('/users/:id', userController.getUserById);
usersRouter.patch('/users/me/:id', validateInfo, userController.updateProfile);
usersRouter.patch('/users/me/avatar/:id', validateAvatar, userController.updateAvatar);

module.exports = usersRouter;
