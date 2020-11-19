const fs = require('fs');
const path = require('path');
const util = require('util');

const products = require('../products.json');
const productsDefault = require('../products-default.json');
const {
  tasks: { task1: filter, task2: mostExpensiveProduct, task3: formatData },
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

function getRandomInt(min, max) {
  const minV = Math.ceil(min);
  const maxV = Math.floor(max);
  return Math.floor(Math.random() * (maxV - minV + 1)) + minV;
}

function generateDiscount(callback) {
  setTimeout(() => {
    const discount = getRandomInt(1, 99);
    if (discount < 20) callback(null, discount);
    else callback(new Error('The generated discount is too big'));
  }, 50);
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

  const generateSaleItemCB = (itemData) => {
    const { item, index, arr } = itemData;
    generateDiscount((err, res) => {
      if (err) {
        generateSaleItemCB(itemData);
      } else {
        const price = item.price || item.priceForPair;
        const priceNum = Number(price.match(/\d+/));
        const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);
        i += 1;
        arr[index] = { ...item, discount: disc };

        if (i === arr.length) {
          consoleProduct();
        }
      }
    });
  };

  const generateSaleItem = (itemData, discounts = 1) => {
    for (let j = 0; j < discounts; j += 1) {
      generateSaleItemCB(itemData);
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
  const utilPromisify = util.promisify(generateDiscount);
  return utilPromisify()
    .then((res) => {
      const { price } = item;
      const priceNum = Number(price.match(/\d+/));
      const disc = Number(priceNum * ((100 - res) / 100)).toFixed(2);

      return { ...item, discount: disc };
    })
    .catch(() => {
      return itemDiscountPromise(item);
    });
}

function itemDiscountPromiseX2(item) {
  const utilPromisify = util.promisify(generateDiscount);
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
    .catch(() => {
      return itemDiscountPromiseX2(item);
    });
}

function itemDiscountPromiseX3(item) {
  const utilPromisify = util.promisify(generateDiscount);
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
    .catch(() => {
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
};
