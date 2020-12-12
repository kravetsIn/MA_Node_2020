const router = require('express').Router();
const task = require('./task');
const discount = require('./discount');
const products = require('./products');
const store = require('./store');
const db = require('./db');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/task', task);
router.use('/discount', discount);
router.use('/products', products);
router.use('/store', store);
router.use('/db', db);

module.exports = router;
