const products = require('../products.json');
const { task1: filter, task2: mostExpensiveProduct } = require('./task');

function boot(data, key, value) {
  const filterRes = filter(data, key, value);
  console.log(filterRes);

  console.log(mostExpensiveProduct);

  return null;
}

boot(products, 'type', 'socks');
