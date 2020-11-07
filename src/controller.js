const fs = require('fs');
const path = require('path');
const products = require('../products.json');
const productsDefault = require('../products-default.json');
const { task1: filter, task2: mostExpensiveProduct, task3: formatData } = require('./task');

function home(response, queryParams) {
  response.statusCode = 200;
  if (queryParams.default) {
    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(productsDefault));
    response.end('Set default data');
  } else {
    response.end('Server Works');
  }
}

function filterData(response, queryParams) {
  response.statusCode = 200;

  if (queryParams.field && queryParams.value) {
    response.setHeader('Content-Type', 'application/json');
    const filterRes = filter(products, queryParams.field, queryParams.value);
    response.end(JSON.stringify(filterRes));
  } else {
    response.end('Need query "field" and "value"');
  }
}

function expensiveProduct(response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(mostExpensiveProduct));
}

function formatDataHandler(response, queryParams) {
  response.statusCode = 200;

  if (queryParams.field && queryParams.value) {
    response.setHeader('Content-Type', 'application/json');
    const filterRes = filter(products, queryParams.field, queryParams.value);
    const product = formatData(filterRes);
    response.end(JSON.stringify(product));
  } else {
    response.end('Need query "field" and "value"');
  }
}

function setData(data, response) {
  if (!Array.isArray(data)) {
    response.statusCode = 404;
    response.end('JSON must be a array');
  } else {
    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(data));

    response.statusCode = 200;
    response.end('Data updated');
  }
}

module.exports = { home, expensiveProduct, filterData, setData, formatDataHandler };
