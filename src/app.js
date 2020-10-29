const products = require('../products.json');
const { task1: filter } = require('./task');

function boot(data, key, value) {
  const filterRes = filter(data, key, value);
  console.log(filterRes);

  return null;
}

boot(products, 'type', 'socks');
