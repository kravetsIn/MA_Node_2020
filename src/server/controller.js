const fs = require('fs');
const path = require('path');

const products = require('../../products.json');
const productsDefault = require('../../products-default.json');
const {
  tasks: { task1: filter, task2: mostExpensiveProduct, task3: formatData },
  generateDiscount,
  utilPromisify,
} = require('../services');

function home(response) {
  response.statusCode = 200;
  response.end('Server Works');
}

function setDefaultData(response) {
  fs.writeFileSync(path.resolve('products.json'), JSON.stringify(productsDefault));
  response.statusCode = 200;
  response.end('Set default data');
}

function filterData(response, queryParams) {
  if (queryParams.field && queryParams.value) {
    const filterRes = filter(products, queryParams.field, queryParams.value);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(filterRes));
  } else {
    response.statusCode = 400;
    response.end('Need query "field" and "value"');
  }
}

function expensiveProduct(response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(mostExpensiveProduct));
}

function formatDataHandler(response, queryParams) {
  if (queryParams.field && queryParams.value) {
    const filterRes = filter(products, queryParams.field, queryParams.value);
    const product = formatData(filterRes);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(product));
  } else {
    response.statusCode = 400;
    response.end('Need query "field" and "value"');
  }
}

function setData(data, response) {
  if (!Array.isArray(data)) {
    response.statusCode = 400;
    response.end('JSON must be a array');
  } else {
    fs.writeFileSync(path.resolve('products.json'), JSON.stringify(data));

    response.statusCode = 200;
    response.end('Data updated');
  }
}

function notFound(response) {
  response.setHeader('Content-Type', 'text/html');
  response.statusCode = 404;
  response.write('<h1>Not Found</h1>');
  response.end();
}

function discountHandlerCallback(response) {
  let successIterations = 0;

  const consoleProduct = () => {
    const formatProducts = formatData(products);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(formatProducts));
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

function promiseHandler(response) {
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

  Promise.all(data)
    .then((result) => {
      response.statusCode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(result));
    })
    .catch((error) => {
      throw error;
    });
}

async function asyncHandler(response) {
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

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(productsWithDiscount));
}

module.exports = {
  home,
  expensiveProduct,
  filterData,
  setData,
  formatDataHandler,
  setDefaultData,
  notFound,
  discountHandlerCallback,
  promiseHandler,
  asyncHandler,
};
