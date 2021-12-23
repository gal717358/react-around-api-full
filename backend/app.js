const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');
const auth = require('./middleware/auth');
const { createUser, login } = require('./controllers/users');
const { validateUser } = require('./middleware/validations');
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();

console.log(process.env.NODE_ENV);

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/aroundb');
mongoose.connection
  .once('open', () => {
    console.log('connection has been made');
  })
  .on('error', (error) => {
    console.log('connection error', error);
  });
console.log(process.env.NODE_ENV);

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signin', validateUser, login);
app.post('/signup', validateUser, createUser);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Requested resource not found' });
  next();
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
