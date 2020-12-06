const { task3: formatData } = require('../tasks');
const { generateDiscount } = require('./utils');

function discountHandlerCallback(products, cb) {
  let successIterations = 0;

  const consoleProduct = () => {
    const formatProducts = formatData(products);

    cb(null, formatProducts);
  };

  const handleSale = (item, saleNum) => {
    const price = item.discount || item.price || item.priceForPair;
    const priceNum = Number(price.match(/\d+/));
    const disc = Number(priceNum * ((100 - saleNum) / 100)).toFixed(2);
    return { ...item, discount: disc };
  };

  const generateSaleItemCB = (itemData, currentInc = 1, totalInc = 1) => {
    const { item, index, arr } = itemData;

    generateDiscount((err, res) => {
      if (err) {
        generateSaleItemCB(itemData);
      } else {
        if (currentInc === totalInc) {
          successIterations++;
        }

        arr[index] = handleSale(item, res);

        if (successIterations === arr.length) {
          consoleProduct();
        }
      }
    });
  };

  const generateSaleItem = (itemData, discounts = 1) => {
    for (let increment = 0; increment < discounts; increment++) {
      generateSaleItemCB(itemData, increment, discounts);
    }
  };

  products.forEach((item, index, arr) => {
    const itemData = { item, index, arr };

    switch (true) {
      case item.type === 'hat' && item.color === 'red':
        generateSaleItem(itemData, 3);
        break;
      case item.type === 'hat':
        generateSaleItem(itemData, 2);
        break;

      default:
        generateSaleItem(itemData);
        break;
    }
  });
}

module.exports = discountHandlerCallback;
