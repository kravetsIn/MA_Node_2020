const util = require('util');
const { generateDiscount } = require('./utils');

const utilPromisify = util.promisify(generateDiscount);

function promiseHandler(products) {
  const generateSale = () => {
    return utilPromisify()
      .then((res) => {
        return res;
      })
      .catch((error) => {
        if (error.message === 'The generated discount is too big') return generateSale();
        throw error;
      });
  };

  const data = products.myMap((item) => {
    const discounts = [];

    let repeats = 0;
    switch (true) {
      case item.type === 'hat' && item.color === 'red':
        repeats = 3;
        break;
      case item.type === 'hat':
        repeats = 2;
        break;

      default:
        repeats = 1;
        break;
    }

    for (let i = 0; i < repeats; i++) {
      discounts.push(generateSale());
    }

    return Promise.all(discounts)
      .then((discount) => {
        const discountNum = discount.reduce((acc, num) => {
          return (acc * (100 - num)) / 100;
        }, 1);

        item.quantity = item.quantity || 0;
        item.price = item.price || item.priceForPair;

        const priceNum = Number(item.price.match(/\d+/));
        const disc = Number(priceNum * discountNum).toFixed(2);

        return { ...item, discount: disc };
      })
      .catch((error) => {
        throw error;
      });
  });

  return Promise.all(data);
}

module.exports = promiseHandler;
