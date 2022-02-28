require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const corsHandler = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT, DB_ADDRESS } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsHandler);
app.use(requestLogger);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
