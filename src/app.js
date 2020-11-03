const products = require('../products.json');
const { task1: filter, task2: mostExpensiveProduct, task3: formatData } = require('./task');

function boot(data, key, value) {
  const filterRes = filter(data, key, value);
  console.log(filterRes);

  const newProducts = formatData(filterRes);
  console.log(newProducts);

  console.log(mostExpensiveProduct);
}

boot(products, 'type', 'socks');
