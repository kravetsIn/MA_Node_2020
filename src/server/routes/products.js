const express = require('express');
const path = require('path');
const fs = require('fs');

const defaultProducts = require('../../../products-default.json');

const products = express.Router();

products.get('/store/default', async (req, res, next) => {
  try {
    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(defaultProducts));
    res.send('Default data set successfully');
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

products.post('/store/set-products', async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      const err = new Error('Products must be sent');
      err.statusCode = 400;
      throw err;
    }

    if (!Array.isArray(data)) {
      const err = new Error('JSON must be a array');
      err.statusCode = 400;
      throw err;
    }

    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(data));
    res.send('Products updated');
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

module.exports = products;
