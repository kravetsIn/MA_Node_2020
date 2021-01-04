const express = require('express');
const bodyParser = require('body-parser');

const { auth, errorHandler, notFound } = require('./middlewares');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(auth);
app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
