const { task3: formatData } = require('../tasks');
const { generateDiscount } = require('./utils');

async function asyncHandler(products) {
  const generateDiscountAsync = () => {
    return new Promise((resolve, reject) => {
      generateDiscount((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };

  const generateItemDiscount = async (item, iterations) => {
    let successIterations = 0;
    let discount = 1;

    const calcSale = (num) => (100 - num) / 100;

    while (successIterations < iterations) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await generateDiscountAsync();
        successIterations += 1;
        discount *= calcSale(res);
      } catch (error) {
        if (error.message !== 'The generated discount is too big') throw error;
      }
    }

    const price = item.discount || item.price || item.priceForPair;
    const priceNum = Number(price.match(/\d+/));
    const disc = Number(priceNum * discount).toFixed(2);

    item.discount = disc;

    // add new price with discount in item
    return item;
  };

  const promises = [];

  products.forEach((item) => {
    let repeats;
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
    promises.push(generateItemDiscount(item, repeats));
  });
  let productsWithDiscount = await Promise.all(promises);

  productsWithDiscount = formatData(productsWithDiscount);

  return productsWithDiscount;
}

module.exports = asyncHandler;
