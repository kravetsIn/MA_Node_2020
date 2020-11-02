const products = require('../../products.json');

function task2(data) {
  const productHighPrice = data.reduce((prev, item) => {
    if (!item.quantity) return prev;

    const prevPrice = prev.price || prev.priceForPair;
    const prevPriceNum = parseInt(prevPrice.match(/\d+/), 10);
    const prevTotalPrice = prev.quantity * prevPriceNum;

    const price = item.price || item.priceForPair;
    const priceNum = parseInt(price.match(/\d+/), 10);
    const totalPrice = item.quantity * priceNum;

    return prevTotalPrice > totalPrice ? prev : item;
  });

  return productHighPrice;
}

module.exports = task2(products);
