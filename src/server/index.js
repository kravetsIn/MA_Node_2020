const express = require('express');
const bodyParser = require('body-parser');

const { auth, errorHandler, notFound } = require('./middlewares');
const { task, discount, products, store } = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(auth);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/task', task);
app.use('/discount', discount);
app.use('/products', products);
app.use('/store', store);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
