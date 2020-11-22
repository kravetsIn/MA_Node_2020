const fs = require('fs');
const path = require('path');

const products = require('../products.json');
const productsDefault = require('../products-default.json');
const {
  tasks: { task1: filter, task2: mostExpensiveProduct, task3: formatData },
  generateDiscount,
  utilPromisify,
} = require('./services');

function myMapMethod(cb) {
  const newArray = [];

  for (let i = 0; i < this.length; i++) {
    newArray[i] = cb(this[i], i);
  }

  return newArray;
}

Array.prototype.myMap = myMapMethod;

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
  let i = 0;

  const consoleProduct = () => {
    const formatProducts = products.myMap((item) => {
      item.quantity = item.quantity || 0;
      item.price = item.price || item.priceForPair;

      return item;
    });

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
          arr[index] = handleSale(item, res);
          i += 1;
        } else {
          arr[index] = handleSale(item, res);
        }

        if (i === arr.length) {
          consoleProduct();
        }
      }
    });
  };

  const generateSaleItem = (itemData, discounts = 1) => {
    for (let j = 0; j < discounts; j++) {
      generateSaleItemCB(itemData, j, discounts);
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

function itemDiscountPromise(item) {
  return utilPromisify()
    .then((res) => {
      const { price } = item;
      const priceNum = Number(price.match(/\d+/));
      const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);

      return { ...item, discount: disc };
    })
    .catch((error) => {
      console.lor(error.message);
      return itemDiscountPromise(item);
    });
}

function itemDiscountPromiseX2(item) {
  return utilPromisify()
    .then((res) => {
      const { price } = item;
      const priceNum = Number(price.match(/\d+/));
      const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);
      item.discount = disc;

      return utilPromisify();
    })
    .then((res) => {
      item.discount = Number(item.discount * ((100 - res) / 100)).toFixed(2);

      return item;
    })
    .catch((error) => {
      console.lor(error.message);
      return itemDiscountPromiseX2(item);
    });
}

function itemDiscountPromiseX3(item) {
  return utilPromisify()
    .then((res) => {
      const { price } = item;
      const priceNum = Number(price.match(/\d+/));
      const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);
      item.discount = disc;
      return utilPromisify();
    })
    .then((res) => {
      item.discount = Number(item.discount * ((100 - res) / 100)).toFixed(2);
      return utilPromisify();
    })
    .then((res) => {
      item.discount = Number(item.discount * ((100 - res) / 100)).toFixed(2);
      return item;
    })
    .catch((error) => {
      console.lor(error.message);
      return itemDiscountPromiseX3(item);
    });
}

async function discountHandlerPromise(response) {
  const formatProducts = formatData(products);
  const mappedProducts = formatProducts.myMap((item) => {
    switch (true) {
      case item.type === 'hat' && item.color === 'red':
        return itemDiscountPromiseX3(item);

      case item.type === 'hat':
        return itemDiscountPromiseX2(item);

      default:
        return itemDiscountPromise(item);
    }
  });
  const result = await Promise.all(mappedProducts);
  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(result));
}

function generateDiscountAsync() {
  return new Promise((resolve, reject) => {
    generateDiscount((err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function asyncHandler(response) {
  const generateItemDiscount = async (item, iterations) => {
    let successIterations = 0;

    while (successIterations < iterations) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await generateDiscountAsync();
        successIterations += 1;

        const price = item.discount || item.price || item.priceForPair;
        const priceNum = Number(price.match(/\d+/));
        const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);
        item.discount = disc;
      } catch (error) {
        console.log(error.message);
      }
    }
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
  discountHandlerPromise,
  asyncHandler,
};
