const router = require('express').Router();

const products = require('./products');
const types = require('./types');
const colors = require('./colors');

router.use('/products', products);
router.use('/types', types);
router.use('/colors', colors);

module.exports = router;
