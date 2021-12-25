const usersRouter = require('express').Router();
const userController = require('../controllers/users');
const { validateInfo, validateAvatar } = require('../middleware/validations');

usersRouter.get('/users', userController.getAllUsers);
usersRouter.get('/users/me', userController.getCurrentUser);
usersRouter.patch('/users/me', validateInfo, userController.updateProfile);
usersRouter.patch('/users/me/avatar', validateAvatar, userController.updateAvatar);

module.exports = usersRouter;
