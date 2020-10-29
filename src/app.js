const products = require('../products.json');
const { task1: filter, task2: mostExpensiveProduct, task3: formatData } = require('./task');

function boot(data, key, value) {
  const filterRes = filter(data, key, value);
  console.log(filterRes);

  console.log(mostExpensiveProduct);

  const newProducts = formatData(products);
  console.log(newProducts);

  return null;
}

boot(products, 'type', 'socks');
