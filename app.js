require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const corsHandler = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes');
const { createUser, login, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsHandler);
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signout', logout);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
