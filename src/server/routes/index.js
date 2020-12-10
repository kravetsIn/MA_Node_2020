const router = require('express').Router();
const task = require('./task');
const discount = require('./discount');
const products = require('./products');
const store = require('./store');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.use('/task', task);
router.use('/discount', discount);
router.use('/products', products);
router.use('/store', store);

module.exports = router;
