require('dotenv').config();

const http = require('http');
const products = require('../products.json');
const { task1: filter, task2: mostExpensiveProduct, task3: formatData } = require('./task');
const requestHandler = require('./requestHandler');

function boot(data, key, value) {
  const filterRes = filter(data, key, value);
  console.log(filterRes);

  const newProducts = formatData(filterRes);
  console.log(newProducts);

  console.log(mostExpensiveProduct);
}

// boot(products, 'type', 'socks');

const server = http.createServer((req, response) => {
  response.statusCode = 200;

  response.end(process.env.PORT);
});

server.listen(process.env.PORT);
