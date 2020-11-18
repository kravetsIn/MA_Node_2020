const fs = require('fs');
const path = require('path');
const products = require('../products.json');
const productsDefault = require('../products-default.json');
const {
  tasks: { task1: filter, task2: mostExpensiveProduct, task3: formatData },
} = require('./services');

function home(response) {
  response.statusCode = 200;
  response.end('Server Works');
}

function setDefaultData(response) {
  fs.writeFileSync(path.resolve('products.json'), JSON.stringify(productsDefault));
  response.statusCode = 200;
  response.end('Set default data');
}

function filterData(response, queryParams) {
  if (queryParams.field && queryParams.value) {
    const filterRes = filter(products, queryParams.field, queryParams.value);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(filterRes));
  } else {
    response.statusCode = 400;
    response.end('Need query "field" and "value"');
  }
}

function expensiveProduct(response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(mostExpensiveProduct));
}

function formatDataHandler(response, queryParams) {
  if (queryParams.field && queryParams.value) {
    const filterRes = filter(products, queryParams.field, queryParams.value);
    const product = formatData(filterRes);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(product));
  } else {
    response.statusCode = 400;
    response.end('Need query "field" and "value"');
  }
}

function setData(data, response) {
  if (!Array.isArray(data)) {
    response.statusCode = 400;
    response.end('JSON must be a array');
  } else {
    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(data));

    response.statusCode = 200;
    response.end('Data updated');
  }
}

function notFound(res) {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 404;
  res.write('<h1>Not Found</h1>');
  res.end();
}

module.exports = {
  home,
  expensiveProduct,
  filterData,
  setData,
  formatDataHandler,
  setDefaultData,
  notFound,
};
