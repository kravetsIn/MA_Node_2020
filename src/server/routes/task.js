const express = require('express');

const products = require('../../../products.json');
const {
  task: { task1: filterProducts, task2: mostExpensiveProduct, task3: formatProducts },
} = require('../../services');

const task = express.Router();

task.get('/filter', async (req, res, next) => {
  try {
    const { field, value } = req.query;

    if (!(field && value)) {
      const err = new Error('Need query "field" and "value"');
      err.statusCode = 400;
      throw err;
    }

    const filteredProducts = filterProducts(products, field, value);
    res.json(filteredProducts);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

task.get('/max', async (req, res, next) => {
  try {
    res.json(mostExpensiveProduct);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

task.get('/format', async (req, res, next) => {
  try {
    const { field, value } = req.query;

    if (!(field && value)) {
      const err = new Error('Need query "field" and "value"');
      err.statusCode = 400;
      throw err;
    }

    const filterRes = filterProducts(products, field, value);
    console.log(filterRes);
    const product = formatProducts(filterRes);
    console.log(product);

    res.json(product);
  } catch (err) {
    console.log('ERROR:', err.message || err);
    next(err);
  }
});

module.exports = task;
