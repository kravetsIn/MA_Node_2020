const products = require('../../../products.json');

function getTotalPrice(product) {
  const price = product.price || product.priceForPair;
  const priceNum = parseInt(price.match(/\d+/), 10);
  return product.quantity * priceNum;
}

function task2(data) {
  return data.reduce((prev, item) => {
    if (!item.quantity) return prev;

    const prevTotalPrice = getTotalPrice(prev);
    const totalPrice = getTotalPrice(item);

    return prevTotalPrice > totalPrice ? prev : item;
  });
}

module.exports = task2(products);
