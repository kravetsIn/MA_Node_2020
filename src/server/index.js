const express = require('express');
const bodyParser = require('body-parser');

const { auth, errorHandler } = require('./middlewares');
const task = require('./routes/task');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(auth);

app.use('/task', task);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

module.exports = { app };
