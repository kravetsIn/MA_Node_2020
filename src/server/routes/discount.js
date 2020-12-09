const express = require('express');

const {
  discount: { discountHandlerCallback, promiseHandler, asyncHandler },
} = require('../../services');
const products = require('../../../products.json');

const discount = express.Router();

discount.get('/callback', (req, res, next) => {
  try {
    discountHandlerCallback(products, (err, result) => {
      if (err) throw err;

      res.json(result);
    });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

discount.get('/promise', (req, res, next) => {
  try {
    promiseHandler(products)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

discount.get('/async', async (req, res, next) => {
  try {
    const discountProducts = await asyncHandler(products);

    res.json(discountProducts);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

module.exports = discount;
